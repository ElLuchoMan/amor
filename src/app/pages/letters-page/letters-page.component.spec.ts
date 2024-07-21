import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LettersPageComponent } from './letters-page.component';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LettersService } from '../../services/letters.service';

describe('LettersPageComponent', () => {
  let component: LettersPageComponent;
  let fixture: ComponentFixture<LettersPageComponent>;
  let lettersService: LettersService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const lettersServiceMock = {
      getLetters: jest.fn().mockReturnValue(of([]))
    };

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        LettersPageComponent
      ],
      providers: [
        { provide: LettersService, useValue: lettersServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersPageComponent);
    component = fixture.componentInstance;
    lettersService = TestBed.inject(LettersService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load letters on init', () => {
    const mockLetters = [
      { date: '16/07/2024', image: 'image1.jpg', text: 'Letter 1' },
      { date: '17/07/2024', image: 'image2.jpg', text: 'Letter 2' }
    ];
    jest.spyOn(lettersService, 'getLetters').mockReturnValue(of(mockLetters));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.letters).toEqual(mockLetters);
  });

  it('should handle error when fetching letters', () => {
    const error = new Error('Error fetching letters');
    jest.spyOn(lettersService, 'getLetters').mockReturnValue(throwError(error));
    const consoleSpy = jest.spyOn(console, 'error');

    component.ngOnInit();
    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching letters:', error);
  });

  it('should navigate to letter detail page', () => {
    const routerSpy = jest.spyOn(router, 'navigate');
    const mockLetter = { date: '16/07/2024', image: 'image1.jpg', text: 'Letter 1' };

    component.viewLetter(mockLetter);

    expect(routerSpy).toHaveBeenCalledWith(['/letter', mockLetter.date]);
  });

  it('should navigate to specified page', () => {
    const routerSpy = jest.spyOn(router, 'navigate');

    component.goToPage('home');

    expect(routerSpy).toHaveBeenCalledWith(['home']);
  });
});
