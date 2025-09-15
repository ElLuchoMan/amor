import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayBalloonsComponent } from './birthday-balloons.component';

describe('BirthdayBalloonsComponent', () => {
  let component: BirthdayBalloonsComponent;
  let fixture: ComponentFixture<BirthdayBalloonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthdayBalloonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirthdayBalloonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate balloons when show is true', () => {
    component.show = true;
    component.ngOnInit();
    expect(component.balloons.length).toBeGreaterThan(0);
  });

  it('should hide balloons after duration', (done) => {
    component.show = true;
    component.duration = 100; // 100ms for testing
    component.ngOnInit();
    
    setTimeout(() => {
      expect(component.show).toBeFalsy();
      done();
    }, 150);
  });
});
