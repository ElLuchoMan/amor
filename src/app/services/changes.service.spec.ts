import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChangesService } from './changes.service';
import { environment } from '../environments/environment';

describe('ChangesService', () => {
  let service: ChangesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChangesService]
    });

    service = TestBed.inject(ChangesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of changes', () => {
    const dummyChanges = ['Change 1', 'Change 2'];

    service.getChanges().subscribe(changes => {
      expect(changes.length).toBe(2);
      expect(changes).toEqual(dummyChanges);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/get-changes`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyChanges);
  });
});
