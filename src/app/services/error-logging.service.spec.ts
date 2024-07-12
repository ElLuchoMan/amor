import { TestBed } from '@angular/core/testing';
import { ErrorLoggingService } from './error-logging.service';

describe('ErrorLoggingService', () => {
  let service: ErrorLoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorLoggingService);
    const mockDate = new Date(2024, 6, 7, 21, 24, 22);
    globalThis.Date = jest.fn(() => mockDate) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log a string error', () => {
    service.logError('Test error');
    expect(service.getErrors().length).toBe(1);
    expect(service.getErrors()[0]).toContain('Test error');
  });

  it('should log an instance of Error', () => {
    const error = new Error('Instance error');
    service.logError(error);
    expect(service.getErrors().length).toBe(1);
    expect(service.getErrors()[0]).toContain('Instance error');
  });

  it('should log an error object', () => {
    const error = {
      message: 'Object error',
      name: 'ErrorName',
      status: 404,
      statusText: 'Not Found',
      url: 'http://example.com',
      error: {
        message: 'Inner error',
      }
    };
    service.logError(error);
    expect(service.getErrors().length).toBe(1);
    expect(service.getErrors()[0]).toContain('Object error');
    expect(service.getErrors()[0]).toContain('Inner error');
  });

  it('should log an unknown error', () => {
    const unknownError = { unexpected: 'error' };
    service.logError(unknownError);
    expect(service.getErrors().length).toBe(1);
  });

  it('should clear errors', () => {
    service.logError('Test error');
    service.clearErrors();
    expect(service.getErrors().length).toBe(0);
  });

  it('should simplify string error', () => {
    const simplified = service.simplifyError('Simple error');
    expect(simplified).toBe('Simple error');
  });

  it('should simplify instance of Error', () => {
    const error = new Error('Instance error');
    const simplified = service.simplifyError(error);
    expect(simplified).toBe('Instance error');
  });

  it('should simplify an error object', () => {
    const error = {
      message: 'Object error',
      name: 'ErrorName',
      status: 404,
      statusText: 'Not Found',
      url: 'http://example.com',
      error: {
        message: 'Inner error',
      }
    };
    const simplified = service.simplifyError(error);
    expect(simplified).toContain('"message":"Object error"');
    expect(simplified).toContain('"name":"ErrorName"');
    expect(simplified).toContain('"status":404');
    expect(simplified).toContain('"statusText":"Not Found"');
    expect(simplified).toContain('"url":"http://example.com"');
    expect(simplified).toContain('{\"message\":\"Object error\",\"name\":\"ErrorName\",\"status\":404,\"statusText\":\"Not Found\",\"url\":\"http://example.com\",\"error\":\"{\\"message\\":\\"Inner error\\"}\"');
  });

  it('should simplify an unknown error object', () => {
    const unknownError = {};
    const simplified = service.simplifyError(unknownError);
    expect(simplified).toBe(JSON.stringify(unknownError));
  });

  it('should simplify to unknown error message', () => {
    const simplified = service.simplifyError(null);
    expect(simplified).toBe('An unknown error occurred');
  });
});
