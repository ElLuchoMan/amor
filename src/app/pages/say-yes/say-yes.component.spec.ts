import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SayYesComponent } from './say-yes.component';
import { ToastrModule, ToastrService, TOAST_CONFIG } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { SongsService } from '../../services/songs.service';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

describe('SayYesComponent', () => {
  let component: SayYesComponent;
  let fixture: ComponentFixture<SayYesComponent>;
  let songsService: SongsService;
  let toastrService: ToastrService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [SayYesComponent],
      providers: [
        SongsService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SayYesComponent);
    component = fixture.componentInstance;
    songsService = TestBed.inject(SongsService);
    toastrService = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('should fetch image and insta on init', () => {
    const mockData = { image: 'test-image', insta: 'test-insta' };
    spyOn(songsService, 'listSongs').and.returnValue(of(mockData));

    component.getImage();

    expect(component.image).toBe('test-image');
    expect(component.insta).toBe('test-insta');
  });

  it('should handle error when fetching image and insta', () => {
    const mockError = new Error('Error fetching data');
    jest.spyOn(toastrService, 'error');
    component.getImage();
    expect(toastrService.error).toHaveBeenCalledWith(`Error fetching image and insta: ${mockError} `, 'ERROR');
  });
*/
  it('should initialize modal after view init', () => {
    component.exampleModalElement = {
      nativeElement: document.createElement('div')
    } as ElementRef;

    component.ngAfterViewInit();

    expect(component['modal']).toBeDefined();
  });

  it('should handle error when modal element is not found', () => {
    jest.spyOn(toastrService, 'error');
    component.exampleModalElement = undefined!;
    component.initModal();
  });

  /* it('should open modal', () => {
     component.exampleModalElement = {
       nativeElement: document.createElement('div')
     } as ElementRef;
     component.ngAfterViewInit();
 
     jest.spyOn(component['modal']!, 'show');
 
     component.openModal();
 
     expect(component['modal']!.show).toHaveBeenCalled();
   });
 
  it('should handle error when modal is not initialized', () => {
     jest.spyOn(toastrService, 'error');
     component.openModal();
     expect(toastrService.error).toHaveBeenCalledWith('Modal is not initialized', 'ERROR');
   });
   it('should navigate to specific page', () => {
     jest.spyOn(router, 'navigate');
 
     component.goToPage('test-page');
 
     expect(router.navigate).toHaveBeenCalledWith(['test-page']);
   });
   */
});
