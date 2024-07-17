import { TestBed } from '@angular/core/testing';
import { ServiceWorkerService } from './service-worker.service';

describe('ServiceWorkerService', () => {
  let service: ServiceWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve the promise when service worker registration is successful', async () => {
    const registerMock = jest.fn().mockResolvedValue(Promise.resolve());

    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: registerMock
      },
      writable: true
    });

    await expect(service.registerServiceWorker()).resolves.toBeUndefined();
    expect(registerMock).toHaveBeenCalledWith('/firebase-messaging-sw.js');
  });

  it('should reject the promise when service worker registration fails', async () => {
    const mockError = new Error('Registration failed');
    const registerMock = jest.fn().mockRejectedValue(mockError);

    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: registerMock
      },
      writable: true
    });

    await expect(service.registerServiceWorker()).rejects.toThrow('Service Worker registration failed: Registration failed');
    expect(registerMock).toHaveBeenCalledWith('/firebase-messaging-sw.js');
  });
});
