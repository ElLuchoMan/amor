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
});
