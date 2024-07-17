import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResourcesService } from './resources.service';
import { environment } from '../environments/environment';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResourcesService]
    });

    service = TestBed.inject(ResourcesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of resources', () => {
    const dummyResources = [{ type: 'image', url: 'http://example.com/image.jpg' }];

    service.listResources().subscribe(resources => {
      expect(resources.length).toBe(1);
      expect(resources).toEqual(dummyResources);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/get-resources`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResources);
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
});
