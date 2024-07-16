import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SongsService } from './songs.service';
import { environment } from '../environments/environment';
import { PostToken } from '../models/token.model';

describe('SongsService', () => {
  let service: SongsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SongsService]
    });

    service = TestBed.inject(SongsService);
    httpMock = TestBed.inject(HttpTestingController);

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

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of songs', () => {
    const dummySongs = [{ title: 'Song 1' }, { title: 'Song 2' }];

    service.listSongs().subscribe(songs => {
      expect(songs.length).toBe(2);
      expect(songs).toEqual(dummySongs);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/get-songs');
    expect(req.request.method).toBe('GET');
    req.flush(dummySongs);
  });

  it('should post token', () => {
    const token: PostToken = {
      token: '12345',
      user_id: ''
    };

    service.postToken(token).subscribe(response => {
      expect(response).toEqual(token);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/update-token`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(token);
    req.flush(token);
  });

  it('should get token', () => {
    const userId = 'user123';
    const tokenResponse = { token: '12345' };

    service.getToken(userId).subscribe(response => {
      expect(response).toEqual(tokenResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/get-token?user_id=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(tokenResponse);
  });

  it('should generate a UUID with correct format', () => {
    const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{2}-[a-f0-9]{1}$/;

    for (let i = 0; i < 100; i++) {
      const uuid = service.generateUUID();
      expect(uuid).toMatch(uuidPattern);
    }
  });

  it('should generate a UUID', () => {
    const uuid = service.generateUUID();
    expect(uuid).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{2}-[a-f0-9]/);
  });

  it('should correctly apply bitwise operations in UUID generation for y', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const uuid = service.generateUUID();

    const fourthSegment = uuid.split('-')[3];
    const fourthSegmentInt = parseInt(fourthSegment, 16);

    expect((fourthSegmentInt & 0x3)).toBe(0x0);
    expect((fourthSegmentInt | 0x8)).toBe(fourthSegmentInt);

    jest.spyOn(Math, 'random').mockRestore();
  });

  it('should correctly apply bitwise operations in UUID generation for x', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const uuid = service.generateUUID();

    const fourthSegment = uuid.split('-')[3];
    const fourthSegmentInt = parseInt(fourthSegment, 16);

    expect((fourthSegmentInt & 0x3)).toBe(0x0);
    expect((fourthSegmentInt & 0x8)).toBe(0x8);

    jest.spyOn(Math, 'random').mockRestore();
  });

  it('should get a UUID from localStorage', () => {
    const uuid = '16032024-xxxx-xxx-xx-x'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    (localStorage.getItem as jest.Mock).mockReturnValue(uuid);

    expect(service.getUUID()).toBe(uuid);
    expect(localStorage.getItem).toHaveBeenCalledWith(service['storageKey']);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should generate and store a new UUID if none exists in localStorage', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);

    const uuid = service.getUUID();
    expect(uuid).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{2}-[a-f0-9]/);
    expect(localStorage.getItem).toHaveBeenCalledWith(service['storageKey']);
    expect(localStorage.setItem).toHaveBeenCalledWith(service['storageKey'], uuid);
  });

  it('should get URL by type', () => {
    const data = [
      { type: 'image', url: 'http://example.com/image.jpg' },
      { type: 'video', url: 'http://example.com/video.mp4' },
      { type: 'audio', url: 'http://example.com/audio.mp3' }
    ];

    expect(service.getUrlByType(data, 'video')).toBe('http://example.com/video.mp4');
    expect(service.getUrlByType(data, 'audio')).toBe('http://example.com/audio.mp3');
    expect(service.getUrlByType(data, 'image')).toBe('http://example.com/image.jpg');
    expect(service.getUrlByType(data, 'nonexistent')).toBe('');
  });

  it('should fetch list of letters', () => {
    const dummyLetters = [
      { date: '16/07/2024', image: 'image1.jpg', text: 'Letter 1' },
      { date: '17/07/2024', image: 'image2.jpg', text: 'Letter 2' }
    ];

    service.getLetters().subscribe(letters => {
      expect(letters.length).toBe(2);
      expect(letters).toEqual(dummyLetters);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/get-letters');
    expect(req.request.method).toBe('GET');
    req.flush(dummyLetters);
  });

  it('should add a letter', () => {
    const newLetter = { date: '18/07/2024', image: 'image3.jpg', text: 'Letter 3' };

    service.addLetter(newLetter).subscribe(response => {
      expect(response).toEqual(newLetter);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/add-letter`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLetter);
    req.flush(newLetter);
  });
});
