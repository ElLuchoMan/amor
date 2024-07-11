import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SwUpdate, ServiceWorkerModule } from '@angular/service-worker';
import { of, BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { SongsService } from './services/songs.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken, Messaging } from "firebase/messaging";
import { firebaseConfig } from './environments/firebase-config';
import { PostToken } from './models/token.model';
import { MessagePayload } from 'firebase/messaging';

jest.mock("firebase/messaging");

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let songService: SongsService;
  let toastrService: ToastrService;
  let swUpdate: SwUpdate;
  let mockLocalStorage: { [key: string]: string } = {};
  let messagingMock: any = {
    getToken: jest.fn().mockResolvedValue('mock-token'),
    onMessage: jest.fn().mockImplementation((callback) => callback({ notification: { title: 'Test', body: 'Test body' } })),
    app: initializeApp(firebaseConfig)
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        ServiceWorkerModule.register('', { enabled: false })
      ],
      providers: [
        SongsService,
        ToastrService,
        { provide: SwUpdate, useValue: { available: of({}), activated: of({}) } }
      ]
    }).compileComponents();

    globalThis.Notification = {
      requestPermission: jest.fn().mockResolvedValue('granted')
    } as any;

    globalThis.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ measurementId: 'G-HSV6LQVDH8' })
    });

    globalThis.indexedDB = {
      open: jest.fn(),
      deleteDatabase: jest.fn(),
      databases: jest.fn()
    } as any;

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => mockLocalStorage[key] || null,
        setItem: (key: string, value: string) => mockLocalStorage[key] = value,
        clear: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    songService = TestBed.inject(SongsService);
    toastrService = TestBed.inject(ToastrService);
    swUpdate = TestBed.inject(SwUpdate);

    Object.defineProperty(component, 'messaging', {
      get: jest.fn(() => messagingMock)
    });
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should get UUID from songService on init', () => {
    const uuid = 'mock-uuid';
    jest.spyOn(songService, 'getUUID').mockReturnValue(uuid);
    component.ngOnInit();
    expect(component.user_id).toBe(uuid);
  });

  it('should request notification permission', async () => {
    const requestPermissionSpy = jest.spyOn(Notification, 'requestPermission');
    const subscribeToNotificationsSpy = jest.spyOn(component, 'subscribeToNotifications').mockImplementation();

    await component.requestNotificationPermission();
    expect(requestPermissionSpy).toHaveBeenCalled();
    expect(subscribeToNotificationsSpy).toHaveBeenCalled();
  });

  it('should register service worker and listen for messages', async () => {
    const addEventListenerSpy = jest.fn();
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        addEventListener: addEventListenerSpy,
        register: jest.fn().mockResolvedValue({ waiting: null })
      }
    });

    await component.registerServiceWorker();
  });
});
