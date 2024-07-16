import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LettersPageComponent } from './leters-page.component';


describe('LletersPageComponent', () => {
  let component: LettersPageComponent;
  let fixture: ComponentFixture<LettersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LettersPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LettersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
