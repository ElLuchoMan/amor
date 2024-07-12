import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorLogModalComponent } from './error-log-modal.component';
import { ErrorLoggingService } from '../../services/error-logging.service';
import { By } from '@angular/platform-browser';

describe('ErrorLogModalComponent', () => {
  let component: ErrorLogModalComponent;
  let fixture: ComponentFixture<ErrorLogModalComponent>;
  let errorLoggingService: ErrorLoggingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorLogModalComponent],
      providers: [ErrorLoggingService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorLogModalComponent);
    component = fixture.componentInstance;
    errorLoggingService = TestBed.inject(ErrorLoggingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error logs', () => {
    errorLoggingService.logError('Test error');
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('li').textContent).toContain('Test error');
  });

  it('should clear error logs', () => {
    errorLoggingService.logError('Test error');
    component.ngOnInit();
    fixture.detectChanges();

    component.clearErrors();
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('li')).toBeNull();
  });
});
