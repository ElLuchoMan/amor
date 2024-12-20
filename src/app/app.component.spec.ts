import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { SongsService } from './services/songs.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorLoggingService } from './services/error-logging.service';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { PostToken } from './models/token.model';
import { ErrorLogModalComponent } from './components/error-log-modal/error-log-modal.component';
import { TokenService } from './services/token.service';
import { UUIDService } from './services/uuid.service';
import { ServiceWorkerService } from './services/service-worker.service';

jest.mock('firebase/messaging');

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let songService: SongsService;
  let tokenService: TokenService;
  let uuidService: UUIDService;
  let toastrService: ToastrService;
  let modalService: NgbModal;
  let errorLoggingService: ErrorLoggingService;
  let serviceWorkerService: ServiceWorkerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        ServiceWorkerModule.register('', { enabled: false }),
      ],
      providers: [
        SongsService,
        TokenService,
        UUIDService,
        ToastrService,
        ErrorLoggingService,
        NgbModal,
        ServiceWorkerService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    songService = TestBed.inject(SongsService);
    tokenService = TestBed.inject(TokenService);
    uuidService = TestBed.inject(UUIDService);
    toastrService = TestBed.inject(ToastrService);
    modalService = TestBed.inject(NgbModal);
    errorLoggingService = TestBed.inject(ErrorLoggingService);
    serviceWorkerService = TestBed.inject(ServiceWorkerService);
  }));

  globalThis.Notification = {
    requestPermission: jest.fn().mockResolvedValue('granted'),
    prototype: {
      showNotification: jest.fn()
    }
  } as any;

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should get UUID from uuidService on init', () => {
    const uuid = '16032024-xxxx-xxx-xx-x'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      return r.toString(16);
    });
    jest.spyOn(uuidService, 'getUUID').mockReturnValue(uuid);
    component.ngOnInit();
    expect(component.user_id).toBeDefined();
  });

  it('should request notification permission', async () => {
    const requestPermissionSpy = jest.spyOn(Notification, 'requestPermission');
    const subscribeToNotificationsSpy = jest.spyOn(component, 'subscribeToNotifications').mockImplementation();

    await component.requestNotificationPermission();
    expect(requestPermissionSpy).toHaveBeenCalled();
    expect(subscribeToNotificationsSpy).toHaveBeenCalled();
  });

  it('should handle denied notification permission', async () => {
    jest.spyOn(Notification, 'requestPermission').mockResolvedValue('denied');
    const openModalSpy = jest.spyOn(component, 'openModal');

    await component.requestNotificationPermission();
    expect(openModalSpy).toHaveBeenCalledWith('No se han otorgado permisos para notificaciones.');
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

  it('should register service worker and handle success', async () => {
    jest.spyOn(serviceWorkerService, 'registerServiceWorker').mockResolvedValue();

    await component.registerServiceWorker();

    expect(serviceWorkerService.registerServiceWorker).toHaveBeenCalled();
  });

  it('should handle service worker registration failure', async () => {
    const mockError = new Error('Service Worker registration failed');
    jest.spyOn(serviceWorkerService, 'registerServiceWorker').mockRejectedValue(mockError);
    const openModalSpy = jest.spyOn(component, 'openModal');

    await component.registerServiceWorker();

    expect(serviceWorkerService.registerServiceWorker).toHaveBeenCalled();
    expect(openModalSpy).toHaveBeenCalledWith(`Service Worker registration failed: undefined`);
  });

  it('should get token on init', async () => {
    const getTokenSpy = jest.spyOn(tokenService, 'getToken').mockReturnValue(of({ token: 'mock-token' }));
    await component.getToken();
    expect(getTokenSpy).toHaveBeenCalled();
  });

  it('should handle get token error', async () => {
    const openModalSpy = jest.spyOn(component, 'openModal').mockImplementation();
    const getTokenSpy = jest.spyOn(tokenService, 'getToken').mockReturnValue(throwError(new Error('error')));

    await component.getToken();
    expect(openModalSpy).toHaveBeenCalled();
  });

  it('should listen for messages', () => {
    const toastrSpy = jest.spyOn(toastrService, 'info').mockImplementation();
    const mockPayload = {
      notification: {
        title: 'Test title',
        body: 'Test body',
        image: 'test-image-url'
      }
    };

    (onMessage as jest.Mock).mockImplementation((messaging, callback) => {
      callback(mockPayload);
    });

    component.listenForMessages();

    expect(toastrSpy).toHaveBeenCalledWith(mockPayload.notification.body, mockPayload.notification.title);
  });

  it('should show notification if permission is granted', () => {
    const mockNotification = jest.fn();
    const originalNotification = globalThis.Notification;

    globalThis.Notification = mockNotification as any;

    Object.defineProperty(Notification, 'permission', {
      get: jest.fn(() => 'granted')
    });

    const title = 'Test title';
    const body = 'Test body';
    const icon = 'test-icon';

    component.showNotification(title, body, icon);

    expect(mockNotification).toHaveBeenCalledWith(title, { body, icon });

    globalThis.Notification = originalNotification;
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

  it('should subscribe to notifications and handle token correctly', async () => {
    const mockToken = 'mock-token';
    const postToken: PostToken = { token: mockToken, user_id: component.user_id };

    (getToken as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(tokenService, 'postToken').mockReturnValue(of(postToken));
    jest.spyOn(component, 'getToken');
    jest.spyOn(component, 'openModal');
    jest.spyOn(errorLoggingService, 'logError');

    await component.subscribeToNotifications();

    expect(tokenService.token).toBe(mockToken);
    expect(tokenService.postToken).toHaveBeenCalledWith(postToken);
    expect(component.getToken).toHaveBeenCalled();
    expect(component.openModal).not.toHaveBeenCalled();
  });

  it('should handle error when token is not available', async () => {
    (getToken as jest.Mock).mockResolvedValue(null);
    jest.spyOn(component, 'openModal');
    jest.spyOn(errorLoggingService, 'logError');

    await component.subscribeToNotifications();

    expect(component.openModal).toHaveBeenCalledWith('No hay un token de registro disponible. Solicita permiso para generar uno.');
  });

  it('should handle error when getting token fails', async () => {
    const mockError = new Error('mock error');

    (getToken as jest.Mock).mockRejectedValue(mockError);
    jest.spyOn(component, 'openModal');
    jest.spyOn(errorLoggingService, 'logError');

    await component.subscribeToNotifications();

    expect(errorLoggingService.logError).toHaveBeenCalledWith(mockError);
    expect(component.openModal).toHaveBeenCalledWith(`Se produjo un error al recuperar el token: ${errorLoggingService.logError(mockError)}`);
  });

  it('should handle error when postToken fails', async () => {
    const mockToken = 'mock-token';
    const mockError = new Error('mock error');
    const postToken: PostToken = { token: mockToken, user_id: component.user_id };

    (getToken as jest.Mock).mockResolvedValue(mockToken);
    jest.spyOn(tokenService, 'postToken').mockReturnValue(throwError(mockError));
    jest.spyOn(component, 'openModal');
    jest.spyOn(errorLoggingService, 'logError');

    await component.subscribeToNotifications();

    expect(tokenService.token).toBe(mockToken);
    expect(tokenService.postToken).toHaveBeenCalledWith(postToken);
    expect(errorLoggingService.logError).toHaveBeenCalledWith(mockError);
    expect(component.openModal).toHaveBeenCalledWith(`Error enviando token al servidor: ${errorLoggingService.logError(mockError)}`);
  });
});
