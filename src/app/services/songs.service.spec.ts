import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SongsService } from './songs.service';

describe('SongsService', () => {
  let service: SongsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SongsService],
    });
    service = TestBed.inject(SongsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a UUID', () => {
    const uuid = service.generateUUID();
    expect(uuid).toMatch(/16032024-[a-z0-9]{4}-[a-z0-9]{3}-[a-z0-9]{2}-[a-z0-9]{1}/);
  });
});
