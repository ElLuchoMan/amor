// src/app/components/header/header.component.spec.ts

import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { SongsService } from '../../services/songs.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        HeaderComponent // Importar el componente como independiente
      ],
      providers: [
        SongsService,
        ToastrService
      ]
    }).compileComponents();

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(),
      },
      writable: true
    });

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should get UUID from songService on init', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    const songService = TestBed.inject(SongsService);
    const uuid = 'mock-uuid';
    jest.spyOn(songService, 'getUUID').mockReturnValue(uuid);
    fixture.detectChanges();
    expect(component.user_id).toBe(uuid);
  });

  it('should copy UUID to clipboard', async () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    component.user_id = 'mock-uuid';
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    await component.copyTokenToClipboard();
    expect(writeTextSpy).toHaveBeenCalledWith('mock-uuid');
  });
});
