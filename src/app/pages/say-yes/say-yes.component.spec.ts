import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SayYesComponent } from './say-yes.component';

describe('SayYesComponent', () => {
  let component: SayYesComponent;
  let fixture: ComponentFixture<SayYesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SayYesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SayYesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
