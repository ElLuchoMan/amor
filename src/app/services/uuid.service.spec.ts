import { TestBed } from '@angular/core/testing';
import { UUIDService } from './uuid.service';

describe('UUIDService', () => {
  let service: UUIDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UUIDService);

    const store: { [key: string]: string } = {};
    const mockLocalStorage = {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        for (let key in store) {
          delete store[key];
        }
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      })
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a UUID with correct format', () => {
    const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{2}-[a-f0-9]{1}$/;

    for (let i = 0; i < 100; i++) {
      const uuid = service.generateUUID();
      expect(uuid).toMatch(uuidPattern);
    }
  });

  it('should get a UUID from localStorage', () => {
    const uuid = '16032024-xxxx-xxx-xx-x'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });

    (localStorage.getItem as jest.Mock).mockReturnValue(uuid);

    expect(service.getUUID()).toBe(uuid);
    expect(localStorage.getItem).toHaveBeenCalledWith('user-uuid');
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should generate and store a new UUID if none exists in localStorage', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);

    const uuid = service.getUUID();
    expect(uuid).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{2}-[a-f0-9]/);
    expect(localStorage.getItem).toHaveBeenCalledWith('user-uuid');
    expect(localStorage.setItem).toHaveBeenCalledWith('user-uuid', uuid);
  });
});
