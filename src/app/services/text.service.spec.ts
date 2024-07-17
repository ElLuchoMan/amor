import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TextService } from './text.service';
import { environment } from '../environments/environment';

describe('TextService', () => {
  let service: TextService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TextService]
    });

    service = TestBed.inject(TextService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch text', () => {
    const dummyText = { text: 'Sample text' };

    service.getText().subscribe(text => {
      expect(text).toEqual(dummyText);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/get-text`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyText);
  });
});
