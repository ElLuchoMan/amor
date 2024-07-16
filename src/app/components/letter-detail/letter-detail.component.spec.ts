import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LetterDetailComponent } from './letter-detail.component';
import { SongsService } from '../../services/songs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('LetterDetailComponent', () => {
  let component: LetterDetailComponent;
  let fixture: ComponentFixture<LetterDetailComponent>;
  let songsService: SongsService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(waitForAsync(() => {
    const songsServiceMock = {
      getLetters: jest.fn().mockReturnValue(of([
        { date: '16/07/2024', image: 'image1.jpg', text: 'Letter 1' },
        { date: '17/07/2024', image: 'image2.jpg', text: 'Letter 2' }
      ]))
    };

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        LetterDetailComponent
      ],
      providers: [
        { provide: SongsService, useValue: songsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('16/07/2024')
              }
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterDetailComponent);
    component = fixture.componentInstance;
    songsService = TestBed.inject(SongsService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load letter on init', () => {
    const mockLetter = { date: '16/07/2024', image: 'image1.jpg', text: 'Letter 1' };

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.letter).toEqual(mockLetter);
  });

  it('should navigate back to letters page', () => {
    const routerSpy = jest.spyOn(router, 'navigate');

    component.goBack();
    expect(routerSpy).toHaveBeenCalledWith(['/letters']);
  });
});
