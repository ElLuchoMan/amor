import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { environment } from '../environments/environment';
import { PostToken } from '../models/token.model';

describe('TokenService', () => {
  let service: TokenService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TokenService]
    });

    service = TestBed.inject(TokenService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
});
