import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelloComponent } from './hello.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { SongsService } from '../../services/songs.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HelloComponent', () => {
  let component: HelloComponent;
  let fixture: ComponentFixture<HelloComponent>;
  let songsService: SongsService;
  let toastrService: ToastrService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        HelloComponent
      ],
      providers: [
        SongsService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloComponent);
    component = fixture.componentInstance;
    songsService = TestBed.inject(SongsService);
    toastrService = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch text on init', () => {
    const mockData = [{ letter: 'line1\n\nline2' }];
    jest.spyOn(songsService, 'listText').mockReturnValue(of(mockData));
    jest.spyOn(toastrService, 'success');

    component.ngOnInit();

    expect(component.text).toEqual([['line', '1', ''], ['line', '2', '']]);
    expect(component.isLoading).toBeFalsy();
    expect(toastrService.success).toHaveBeenCalledWith('Información cargada', '¡BIEN!');
  });

  it('should handle error when fetching text', () => {
    const mockError = new Error('Error fetching data');
    jest.spyOn(songsService, 'listText').mockReturnValue(throwError(mockError));
    jest.spyOn(toastrService, 'error');

    component.ngOnInit();

    expect(component.isLoading).toBeFalsy();
    expect(toastrService.error).toHaveBeenCalledWith(`Error fetching letter: ${mockError} `, 'ERROR');
  });

  it('should navigate to specific page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.goToPage('test-page');

    expect(navigateSpy).toHaveBeenCalledWith(['test-page']);
  });

  it('should correctly identify numbers', () => {
    expect(component.isNumber('123')).toBe(true);
    expect(component.isNumber('  123  ')).toBe(true);
    expect(component.isNumber('abc')).toBe(false);
    expect(component.isNumber('123abc')).toBe(false);
    expect(component.isNumber('')).toBe(false);
    expect(component.isNumber(' ')).toBe(false);
    expect(component.isNumber('12.3')).toBe(true);
    expect(component.isNumber('12,3')).toBe(false);
  });
});
