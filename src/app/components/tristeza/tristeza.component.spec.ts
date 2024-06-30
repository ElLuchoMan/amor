import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TristezaComponent } from './tristeza.component';

describe('TristezaComponent', () => {
  let component: TristezaComponent;
  let fixture: ComponentFixture<TristezaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TristezaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TristezaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
