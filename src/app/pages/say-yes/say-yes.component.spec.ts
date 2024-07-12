import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SayYesComponent } from './say-yes.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { SongsService } from '../../services/songs.service';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

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
    }).compileComponents();
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
    expect(toastrService.error).toHaveBeenCalledWith('Modal element not found', 'ERROR');
  });

  it('should open modal when modal is initialized', () => {
    const modalElement = document.createElement('div');
    component.exampleModalElement = { nativeElement: modalElement } as ElementRef;
    component.ngAfterViewInit();
    const modalInstance = component['modal'];
    jest.spyOn(modalInstance!, 'show');
  });

  it('should handle error when modal is not initialized', () => {
    jest.spyOn(toastrService, 'error');
    component['modal'] = undefined;
    component.openModal();
    expect(toastrService.error).toHaveBeenCalledWith('Modal is not initialized', 'ERROR');
  });

  it('should fetch resources on init', () => {
    const mockData = [
      { type: 'image', url: 'image-url' },
      { type: 'insta', url: 'insta-url' },
      { type: 'youtube', url: 'youtube-url' }
    ];
    jest.spyOn(songsService, 'listResources').mockReturnValue(of(mockData));

    component.ngOnInit();

    expect(component.image).toBe('image-url');
    expect(component.insta).toBe('insta-url');
    expect(component.youtube).toBe('youtube-url');
  });

  it('should handle error when fetching resources', () => {
    const mockError = new Error('Error fetching data');
    jest.spyOn(songsService, 'listResources').mockReturnValue(throwError(mockError));
    jest.spyOn(toastrService, 'error');

    component.ngOnInit();

    expect(toastrService.error).toHaveBeenCalledWith(`Error fetching image and insta: ${mockError} `, 'ERROR');
  });

  it('should navigate to a different page', () => {
    jest.spyOn(router, 'navigate');
    component.goToPage('hello');
    expect(router.navigate).toHaveBeenCalledWith(['hello']);
  });

  it('should redirect to youtube link', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { href: '' };

    component.youtube = 'https://youtu.be/7oKZeo779Xg?si=f69rP2eFTD26J6Sl&t=101';
    component.salirDePagina();

    expect(window.location.href).toBe('https://youtu.be/7oKZeo779Xg?si=f69rP2eFTD26J6Sl&t=101');

    window.location = originalLocation;
  });
});
