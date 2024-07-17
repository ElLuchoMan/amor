import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogModalComponent } from './error-log-modal.component';
import { ErrorLoggingService } from '../../services/error-logging.service';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('ErrorLogModalComponent', () => {
  let component: ErrorLogModalComponent;
  let fixture: ComponentFixture<ErrorLogModalComponent>;
  let errorLoggingService: Partial<ErrorLoggingService>;

  beforeEach(waitForAsync(() => {
    errorLoggingService = {
      getErrors: jest.fn().mockReturnValue(['Error 1', 'Error 2']),
      clearErrors: jest.fn().mockImplementation(() => { })
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModalModule],
      providers: [
        { provide: ErrorLoggingService, useValue: errorLoggingService },
        NgbActiveModal
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorLogModalComponent);
    component = fixture.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load error logs on init', () => {
    fixture.detectChanges();
    expect(component.errorLogs.length).toBe(2);
    expect(component.errorLogs).toEqual(['Error 1', 'Error 2']);
  });

  it('should clear errors when clearErrors is called', () => {
    fixture.detectChanges();
    component.clearErrors();
    fixture.detectChanges();
    expect(component.errorLogs.length).toBe(0);
    expect(errorLoggingService.clearErrors).toHaveBeenCalled();
  });

  it('should call clearErrors method on button click', () => {
    jest.spyOn(component, 'clearErrors');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.clear-errors'));
    expect(button).not.toBeNull();
    button.triggerEventHandler('click', null);
    expect(component.clearErrors).toHaveBeenCalled();
  });
});
