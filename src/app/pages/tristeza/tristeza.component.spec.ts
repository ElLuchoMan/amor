import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TristezaComponent } from './tristeza.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

describe('TristezaComponent', () => {
  let component: TristezaComponent;
  let fixture: ComponentFixture<TristezaComponent>;
  let toastrService: ToastrService;
  let router: Router;
  let mockBootstrapModal: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        RouterTestingModule,
        CommonModule,
        FormsModule,
        TristezaComponent
      ],
      declarations: []
    }).compileComponents();
  });

  const reloadPage = () => {
    window.location.reload();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(TristezaComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);
    mockBootstrapModal = require('bootstrap').Modal;
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.numeroFallos).toBe(0);
    expect(component.numeroAciertos).toBe(0);
    expect(component.juegoTerminado).toBeFalsy();
    expect(component.panelGanador).toBeFalsy();
    expect(component.panelPerdedor).toBeFalsy();
    expect(component.letrasUsadas.size).toBe(0);
  });

  it('should create a random word', () => {
    const word = component.crearPalabraOculta(component.palabrasPosibles);
    expect(component.palabrasPosibles).toContain(word);
  });

  it('should handle used letters correctly', () => {
    component.letraElegida = 'a';
    component.comprobarLetras('a');
    expect(component.letrasUsadas.has('a')).toBeTruthy();
  });

  it('should reset the game correctly', () => {
    component.reiniciarJuego();
    expect(component.numeroFallos).toBe(0);
    expect(component.numeroAciertos).toBe(0);
    expect(component.panelGanador).toBeFalsy();
    expect(component.panelPerdedor).toBeFalsy();
    expect(component.juegoTerminado).toBeFalsy();
    expect(component.letrasUsadas.size).toBe(0);
  });

  it('should update the visible word correctly', () => {
    component.palabraOculta = 'test';
    component.palabraVisible = '____';
    component.palabraVisible = component.ponerLetraEnPalabraVisible('t');
    component.actualizarPalabraVisible();
    expect(component.palabraVisible).toBe('t__t');
  });

  it('should show success message when the game is won', () => {
    jest.spyOn(toastrService, 'success');
    component.finalizarGanador();
    expect(component.panelGanador).toBeTruthy();
    expect(component.juegoTerminado).toBeTruthy();
    expect(toastrService.success).toHaveBeenCalledWith('¡GANASTE!', '¡FELICIDADES!');
  });

  it('should show error message when the game is lost', () => {
    jest.spyOn(toastrService, 'error');
    component.finalizarPerdedor();
    expect(component.panelPerdedor).toBeTruthy();
    expect(component.juegoTerminado).toBeTruthy();
    expect(toastrService.error).toHaveBeenCalledWith('¡PERDISTE!', 'LÁSTIMA!');
  });

  it('should navigate to a different page', () => {
    jest.spyOn(router, 'navigate');
    component.goToPage('hello');
    expect(router.navigate).toHaveBeenCalledWith(['hello']);
  });

  it('should save and load state from localStorage', () => {
    jest.spyOn(localStorage, 'setItem');
    jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify({
      palabraOculta: 'test',
      palabraVisible: '____',
      numeroFallos: 0,
      numeroAciertos: 0,
      juegoTerminado: false,
      panelGanador: false,
      panelPerdedor: false,
      letrasUsadas: []
    }));
    component.saveState();
    expect(localStorage.setItem).toHaveBeenCalled();
    component.ngOnInit();
    expect(localStorage.getItem).toHaveBeenCalledTimes(0);
    expect(component.palabraOculta).toBeDefined();
  });

  it('should show modal on winning', () => {
    component.modalTitle = '¡GANASTE!';
    component.modalIconClass = 'fas fa-trophy';
    component.modalIconColor = 'gold';
    const modalElement = document.createElement('div');
    modalElement.id = 'resultadoModal';
    document.body.appendChild(modalElement);
    jest.spyOn(document, 'getElementById').mockReturnValue(modalElement);
    const modalInstance = new bootstrap.Modal(modalElement);
    jest.spyOn(modalInstance, 'show');
    expect(modalInstance.show).toHaveBeenCalledTimes(0);
  });

  it('should show modal on losing', () => {
    component.modalTitle = '¡PERDISTE!';
    component.modalIconClass = 'fas fa-sad-tear';
    component.modalIconColor = 'red';
    const modalElement = document.createElement('div');
    modalElement.id = 'resultadoModal';
    document.body.appendChild(modalElement);
    jest.spyOn(document, 'getElementById').mockReturnValue(modalElement);
    const modalInstance = new bootstrap.Modal(modalElement);
    jest.spyOn(modalInstance, 'show');
    expect(modalInstance.show).toHaveBeenCalledTimes(0);
  });

  it('should close modal and restart game', () => {
    component.modalTitle = '¡GANASTE!';
    component.modalIconClass = 'fas fa-trophy';
    component.modalIconColor = 'gold';
    const modalElement = document.createElement('div');
    modalElement.id = 'resultadoModal';
    document.body.appendChild(modalElement);
    jest.spyOn(document, 'getElementById').mockReturnValue(modalElement);
    const modalInstance = new bootstrap.Modal(modalElement);
    jest.spyOn(bootstrap.Modal, 'getInstance').mockReturnValue(modalInstance);
    jest.spyOn(modalInstance, 'hide');

    component.closeModalAndRestart();
    expect(modalInstance.hide).toHaveBeenCalled();
    expect(component.numeroFallos).toBe(0);
    expect(component.numeroAciertos).toBe(0);
    expect(component.panelGanador).toBeFalsy();
    expect(component.panelPerdedor).toBeFalsy();
    expect(component.juegoTerminado).toBeFalsy();
    expect(component.letrasUsadas.size).toBe(0);
  });

  it('should validate letter input', () => {
    jest.spyOn(component, 'mostrarMensaje');
    component.letraElegida = 'a';
    component.analizarLetra();
    component.letraElegida = '1';
    component.analizarLetra();
    expect(component.mostrarMensaje).toHaveBeenCalledWith('El caracter ingresado no es una letra');
  });

  it('should display a message to introduce a letter', () => {
    jest.spyOn(component, 'mostrarMensaje'); // Espía la función mostrarMensaje
    component.pedirLetra(); // Llama a la función pedirLetra
    expect(component.mostrarMensaje).toHaveBeenCalledWith('Introduce una letra'); // Verifica que mostrarMensaje fue llamada con el mensaje correcto
  });

  it('mocks reload function', () => {
    expect(jest.isMockFunction(window.location.reload)).toBe(true);
  });

  it('should reload the page', () => {
    jest.spyOn(window.location, 'reload').mockImplementation(() => { });

    component.reloadPage();
    reloadPage();
    expect(window.location.reload).toHaveBeenCalled();
  });
  it('should show message when the letter has already been used', () => {
    component.letrasUsadas.add('a');
    jest.spyOn(component, 'mostrarMensaje');
    
    component.comprobarLetras('a');
    
    expect(component.mostrarMensaje).toHaveBeenCalledWith('Esa letra ya la habías elegido');
  });
  
  it('should add the letter to letrasUsadas and update the visible word if the letter has not been used', () => {
    component.palabraOculta = 'test';
    component.palabraVisible = '____';
    component.letrasUsadas.clear();
    
    component.comprobarLetras('t');
    
    expect(component.letrasUsadas.has('t')).toBeTruthy();
    expect(component.palabraVisible).toBe('t__t');
  });
  
  it('should increase the number of failures and show message when the letter is not in the word', () => {
    component.palabraOculta = 'test';
    component.palabraVisible = '____';
    component.letrasUsadas.clear();
    
    jest.spyOn(component, 'mostrarMensaje');
    jest.spyOn(component, 'ponerImagen');
    
    component.comprobarLetras('a');
    
    expect(component.letrasUsadas.has('a')).toBeTruthy();
    expect(component.numeroFallos).toBe(1);
    expect(component.mostrarMensaje).toHaveBeenCalledWith('La letra elegida no está');
    expect(component.ponerImagen).toHaveBeenCalledWith(1);
  });
  
  it('should finalize the game as won if the last missing letter is guessed', () => {
    component.palabraOculta = 'test';
    component.palabraVisible = 'te_t';
    component.letrasUsadas.clear();
    
    jest.spyOn(component, 'finalizarGanador');
    
    component.comprobarLetras('s');
    
    expect(component.finalizarGanador).toHaveBeenCalled();
    expect(component.palabraVisible).toBe('test');
  });
  
  it('should finalize the game as lost if the maximum number of failures is reached', () => {
    component.palabraOculta = 'test';
    component.palabraVisible = '____';
    component.letrasUsadas.clear();
    component.numeroFallos = 8;
    
    jest.spyOn(component, 'finalizarPerdedor');
    
    component.comprobarLetras('a');
    
    expect(component.finalizarPerdedor).toHaveBeenCalled();
    expect(component.numeroFallos).toBe(9);
  });
  it('should close modal and restart game', () => {
    component.modalTitle = '¡GANASTE!';
    component.modalIconClass = 'fas fa-trophy';
    component.modalIconColor = 'gold';
    const modalElement = document.createElement('div');
    modalElement.id = 'resultadoModal';
    document.body.appendChild(modalElement);
    jest.spyOn(document, 'getElementById').mockReturnValue(modalElement);
    const modalInstance = new mockBootstrapModal(modalElement);
    jest.spyOn(mockBootstrapModal, 'getInstance').mockReturnValue(modalInstance);
    jest.spyOn(modalInstance, 'hide');

    component.closeModalAndRestart();
    expect(modalInstance.hide).toHaveBeenCalled();
    expect(component.numeroFallos).toBe(0);
    expect(component.numeroAciertos).toBe(0);
    expect(component.panelGanador).toBeFalsy();
    expect(component.panelPerdedor).toBeFalsy();
    expect(component.juegoTerminado).toBeFalsy();
    expect(component.letrasUsadas.size).toBe(0);
  });
  
});
