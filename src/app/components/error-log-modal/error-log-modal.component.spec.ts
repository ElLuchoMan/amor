import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorLogModalComponent } from './error-log-modal.component';
import { ErrorLoggingService } from '../../services/error-logging.service';

describe('ErrorLogModalComponent', () => {
  let component: ErrorLogModalComponent;
  let fixture: ComponentFixture<ErrorLogModalComponent>;
  let errorLoggingService: ErrorLoggingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorLogModalComponent],
      providers: [ErrorLoggingService]
    }).compileComponents();

    errorLoggingService = TestBed.inject(ErrorLoggingService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display errors from the service', () => {
    errorLoggingService.logError('Test error');
    component.ngOnInit();
    expect(component.errors.length).toBe(1);
    expect(component.errors[0]).toContain('Test error');
  });

  it('should clear errors', () => {
    errorLoggingService.logError('Test error');
    component.ngOnInit();
    component.clearErrors();
    expect(component.errors.length).toBe(0);
    expect(errorLoggingService.getErrors().length).toBe(0);
  });
});
