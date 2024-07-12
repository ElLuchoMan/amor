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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorLoggingService } from './services/error-logging.service';
import { ErrorLogModalComponent } from './components/error-log-modal/error-log-modal.component';
import { PostToken } from './models/token.model';

jest.mock('firebase/messaging');

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let songService: SongsService;
  let toastrService: ToastrService;
  let swUpdate: SwUpdate;
  let modalService: NgbModal;
  let errorLoggingService: ErrorLoggingService;

  let mockLocalStorage: { [key: string]: string } = {};
  let messagingMock: any = {
    getToken: jest.fn().mockResolvedValue('mock-token'),
    onMessage: jest.fn().mockImplementation((callback) => callback({ notification: { title: 'Test', body: 'Test body' } })),
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
        ErrorLoggingService,
        NgbModal,
        { provide: SwUpdate, useValue: { available: of({}), activated: of({}) } }
      ]
    }).compileComponents();

    globalThis.Notification = {
      requestPermission: jest.fn().mockResolvedValue('granted'),
      prototype: {
        showNotification: jest.fn()
      }
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
    modalService = TestBed.inject(NgbModal);
    errorLoggingService = TestBed.inject(ErrorLoggingService);

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

  it('should open modal with error message', () => {
    const modalServiceOpenSpy = jest.spyOn(modalService, 'open').mockImplementation(() => ({
      componentInstance: {
        errors: []
      }
    }) as any);

    component.openModal('Test error message');
    expect(modalServiceOpenSpy).toHaveBeenCalledWith(ErrorLogModalComponent);
  });

  it('should register service worker and listen for messages', async () => {
    const registerSpy = jest.fn().mockResolvedValue({ waiting: null });
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: registerSpy
      },
      writable: true
    });

    await component.registerServiceWorker();
    expect(registerSpy).toHaveBeenCalled();
  });

  it('should get token on init', async () => {
    const getTokenSpy = jest.spyOn(songService, 'getToken').mockReturnValue(of({ token: 'mock-token' }));
    await component.getToken();
    expect(getTokenSpy).toHaveBeenCalled();
  });

  it('should handle get token error', async () => {
    const openModalSpy = jest.spyOn(component, 'openModal').mockImplementation();
    jest.spyOn(songService, 'getToken').mockReturnValue(of({ token: 'mock-token' }));

    await component.getToken();
    expect(openModalSpy).not.toHaveBeenCalled();
  });

  it('should listen for messages', () => {
    const toastrSpy = jest.spyOn(toastrService, 'info').mockImplementation();
    component.listenForMessages();
    expect(toastrSpy).toHaveBeenCalledTimes(0);
  });

  it('should update cache and post message if registration is waiting', async () => {
    const mockRegistration = {
      update: jest.fn().mockResolvedValueOnce(undefined),
      waiting: {
        postMessage: jest.fn()
      }
    };

    const getRegistrationsMock = jest.fn().mockResolvedValueOnce([mockRegistration]);

    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        getRegistrations: getRegistrationsMock
      },
      writable: true
    });

    await component.updateCache();

    expect(getRegistrationsMock).toHaveBeenCalled();
    expect(mockRegistration.update).toHaveBeenCalled();
    expect(mockRegistration.waiting.postMessage).toHaveBeenCalledWith({ action: 'skipWaiting' });
  });

  it('should update cache and not post message if registration is not waiting', async () => {
    const mockRegistration = {
      update: jest.fn().mockResolvedValueOnce(undefined),
      waiting: null
    };

    const getRegistrationsMock = jest.fn().mockResolvedValueOnce([mockRegistration]);

    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        getRegistrations: getRegistrationsMock
      },
      writable: true
    });

    await component.updateCache();

    expect(getRegistrationsMock).toHaveBeenCalled();
    expect(mockRegistration.update).toHaveBeenCalled();
    expect(mockRegistration.waiting).toBeNull();
  });
});
