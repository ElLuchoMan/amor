import { TestBed } from '@angular/core/testing';
import { ErrorLoggingService } from './error-logging.service';

describe('ErrorLoggingService', () => {
  let service: ErrorLoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorLoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log an error', () => {
    service.logError('Test error');
    expect(service.getErrors().length).toBe(1);
    expect(service.getErrors()[0]).toContain('Test error');
  });

  it('should clear errors', () => {
    service.logError('Test error');
    service.clearErrors();
    expect(service.getErrors().length).toBe(0);
  });
});
