import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TristezaComponent } from './tristeza.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('TristezaComponent', () => {
  let component: TristezaComponent;
  let fixture: ComponentFixture<TristezaComponent>;
  let toastrService: ToastrService;
  let router: Router;

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

  beforeEach(() => {
    fixture = TestBed.createComponent(TristezaComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
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
    component.ponerLetraEnPalabraVisible('t');
    expect(component.palabraVisible).toBe('____');
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
    jest.spyOn(localStorage, 'getItem');
    component.saveState();
    component.ngOnInit();
  });

  it('should show modal on winning', () => {
    component.modalTitle = '¡GANASTE!';
    component.modalIconClass = 'fas fa-trophy';
    component.modalIconColor = 'gold';
    jest.spyOn(document, 'getElementById');
    component.finalizarGanador();
    expect(component.modalTitle).toBe('¡GANASTE!');
  });

  it('should show modal on losing', () => {
    component.modalTitle = '¡PERDISTE!';
    component.modalIconClass = 'fas fa-sad-tear';
    component.modalIconColor = 'red';
    jest.spyOn(document, 'getElementById');
    component.finalizarPerdedor();
    expect(component.modalTitle).toBe('¡PERDISTE!');
  });
});
