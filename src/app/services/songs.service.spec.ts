import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SongsService } from './songs.service';
import { environment } from '../environments/environment';

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

    const req = httpMock.expectOne(`${environment.apiUrl}/get-songs`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySongs);
  });
});
