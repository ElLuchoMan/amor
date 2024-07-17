import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LettersService } from './letters.service';
import { environment } from '../environments/environment';

describe('LettersService', () => {
  let service: LettersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LettersService]
    });

    service = TestBed.inject(LettersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of letters', () => {
    const dummyLetters = [{ date: '2024-07-16', image: 'http://example.com/image.jpg', text: 'Sample text' }];

    service.getLetters().subscribe(letters => {
      expect(letters.length).toBe(1);
      expect(letters).toEqual(dummyLetters);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/get-letters`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLetters);
  });

  it('should add a letter', () => {
    const newLetter = { date: '2024-07-17', image: 'http://example.com/image2.jpg', text: 'New text' };

    service.addLetter(newLetter).subscribe(response => {
      expect(response).toEqual(newLetter);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/add-letter`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLetter);
    req.flush(newLetter);
  });
});
