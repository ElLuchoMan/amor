// src/app/components/header/header.component.spec.ts

import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ToastrModule, TOAST_CONFIG } from 'ngx-toastr';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      declarations: [HeaderComponent],
      providers: [
        { provide: TOAST_CONFIG, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
