import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsModalComponent } from './news-modal.component';
import { SongsService } from '../../services/songs.service';
import { of, throwError } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

describe('NewsModalComponent', () => {
  let component: NewsModalComponent;
  let fixture: ComponentFixture<NewsModalComponent>;
  let songsService: SongsService;
  let mockBootstrapModal: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NewsModalComponent, CommonModule],
      providers: [SongsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsModalComponent);
    component = fixture.componentInstance;
    component.appVersion = environment.appVersion;
    songsService = TestBed.inject(SongsService);
    mockBootstrapModal = bootstrap.Modal;
    fixture.detectChanges();

    const store: { [key: string]: string } = {};
    const mockLocalStorage = {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        for (let key in store) {
          delete store[key];
        }
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      })
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });

    const modalElement = document.createElement('div');
    modalElement.id = 'cambiosModal';
    modalElement.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content bg-dark">
          <div class="modal-header bg-dark">
            <h1 class="card-title" id="cambiosModalLabel">Nuevos Cambios</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body bg-dark">
            <ol>
              <li *ngFor="let cambio of nuevosCambios">{{ cambio }}</li>
            </ol>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" id="aceptarCambios" (click)="aceptarCambios()">Aceptar</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modalElement);
    jest.spyOn(document, 'getElementById').mockReturnValue(modalElement);
  });

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: origin });
  });

  afterEach(() => {
    document.getElementById('cambiosModal')?.remove();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.nuevosCambios).toEqual([]);
  });

  it('should show changes modal if changes are not accepted', () => {
    localStorage.getItem = jest.fn().mockReturnValue(null);
    const modalElement = document.getElementById('cambiosModal');
    const modalInstance = new mockBootstrapModal(modalElement);
    jest.spyOn(modalInstance, 'show').mockImplementation(() => { });
    component.checkForChanges();
    expect(modalInstance.show).toHaveBeenCalledTimes(0);
  });

  it('should not show changes modal if changes are accepted and version is the same', () => {
    localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify({ appVersion: '1.4.1', viewed: true }));
    const modalElement = document.getElementById('cambiosModal');
    const modalInstance = new mockBootstrapModal(modalElement);
    jest.spyOn(modalInstance, 'show').mockImplementation(() => { });
    component.checkForChanges();
    expect(modalInstance.show).toHaveBeenCalledTimes(0);
  });

  it('should show changes modal if version is different', () => {
    localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify({ appVersion: '1.4.0', viewed: true }));
    const modalElement = document.getElementById('cambiosModal');
    const modalInstance = new mockBootstrapModal(modalElement);
    jest.spyOn(modalInstance, 'show').mockImplementation(() => { });
    component.checkForChanges();
    expect(modalInstance.show).toHaveBeenCalledTimes(0);
  });

  it('should set cambiosAceptados to true when aceptarCambios is called', () => {
    localStorage.setItem = jest.fn();
    const modalElement = document.getElementById('cambiosModal');
    const modalInstance = new mockBootstrapModal(modalElement);
    jest.spyOn(mockBootstrapModal, 'getInstance').mockReturnValue(modalInstance);
    jest.spyOn(modalInstance, 'hide').mockImplementation(() => { });
    component.aceptarCambios();
    expect(localStorage.setItem).toHaveBeenCalledWith('cambiosInfo', JSON.stringify({ appVersion: '1.4.1', viewed: true }));
    expect(modalInstance.hide).toHaveBeenCalled();
  });

  it('should get changes from the service on init', () => {
    const mockChanges = ['Cambio 1', 'Cambio 2'];
    jest.spyOn(songsService, 'getChanges').mockReturnValue(of(mockChanges));
    component.getChanges();
  });

  it('should handle error when getChanges service fails', () => {
    jest.spyOn(songsService, 'getChanges').mockReturnValue(throwError(() => new Error('Service error')));
    component.getChanges();
    expect(component.nuevosCambios).toEqual([]);
  });

  describe('isSameVersion', () => {
    it('should return false if storedVersion is not provided', () => {
      const result = component.isSameVersion('');
      expect(result).toBeFalsy();
    });

    it('should return true if current and stored versions are the same', () => {
      const result = component.isSameVersion('1.4.1');
      expect(result).toBeTruthy();
    });

    it('should return false if current and stored versions are different', () => {
      const result = component.isSameVersion('1.4.0');
      expect(result).toBeFalsy();
    });
  });
});
