import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-tristeza',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tristeza.component.html',
  styleUrls: ['./tristeza.component.scss']
})
export class TristezaComponent {
  palabrasPosibles: string[] = ["coffie", "milu", "natalia", "mia", "amorcito", "alejandro", "betty", "monchito", "morado", "elefante"];
  toastr = inject(ToastrService);
  router = inject(Router);
  letras: string = "abcdefghijklmnñopqrstuvwxyz";
  palabraOculta: string;
  palabraVisible: string;
  numeroFallos: number = 0;
  numeroAciertos: number = 0;
  mensaje: string = '';
  letraElegida: string = '';
  panelGanador: boolean = false;
  panelPerdedor: boolean = false;
  imagenAhorcado: string = '';
  juegoTerminado: boolean = false;
  letrasUsadas: Set<string> = new Set();
  reiniciarContador: number = 0;
  mostrarCambiarPalabra: boolean = false;

  // Modal properties
  modalTitle: string = '';
  modalIconClass: string = '';
  modalIconColor: string = '';

  constructor() {
    const savedState = localStorage.getItem('hangmanState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.palabraOculta = state.palabraOculta;
      this.palabraVisible = state.palabraVisible;
      this.numeroFallos = state.numeroFallos;
      this.numeroAciertos = state.numeroAciertos;
      this.juegoTerminado = state.juegoTerminado;
      this.panelGanador = state.panelGanador;
      this.panelPerdedor = state.panelPerdedor;
      this.letrasUsadas = new Set(state.letrasUsadas);
    } else {
      this.palabraOculta = this.crearPalabraOculta(this.palabrasPosibles);
      this.palabraVisible = this.crearPalabraVisible(this.palabraOculta);
    }
  }

  ngOnInit(): void {
    this.actualizarPalabraVisible();
  }

  crearPalabraOculta(palabrasPosibles: string[]): string {
    return palabrasPosibles[this.crearRandom(0, palabrasPosibles.length - 1)];
  }

  crearPalabraVisible(palabraOculta: string): string {
    let palabraRetorno = '';
    for (let i = 0; i < palabraOculta.length; i++) {
      palabraRetorno = palabraRetorno.concat('_');
    }
    return palabraRetorno;
  }

  crearRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ponerImagen(numero: number): void {
    this.imagenAhorcado = `../../../assets/img${numero}.jpg`;
    console.log(this.imagenAhorcado);
  }

  pedirLetra(): void {
    this.mostrarMensaje('Introduce una letra');
  }

  mostrarMensaje(mensaje: string): void {
    this.mensaje = mensaje;
  }

  recogerLetra(): string | null {
    return this.letraElegida;
  }

  ponerLetraEnPalabraVisible(letra: string): string {
    let retorno = '';
    for (let i = 0; i < this.palabraOculta.length; i++) {
      if (this.palabraOculta.charAt(i) === letra) {
        retorno = retorno.concat(letra);
      } else {
        retorno = retorno.concat(this.palabraVisible.charAt(i));
      }
    }
    return retorno;
  }

  comprobarGanador(): boolean {
    return this.palabraOculta === this.palabraVisible;
  }

  comprobarLetras(letra: string): void {
    if (this.letrasUsadas.has(letra)) {
      this.mostrarMensaje('Esa letra ya la habías elegido');
      return;
    }

    this.letrasUsadas.add(letra);

    if (this.palabraOculta.includes(letra)) {
      this.palabraVisible = this.ponerLetraEnPalabraVisible(letra);
      this.numeroAciertos++;
      this.actualizarPalabraVisible();
      this.mostrarMensaje('');
    } else {
      this.mostrarMensaje('La letra elegida no está');
      this.numeroFallos++;
      this.ponerImagen(this.numeroFallos);
    }

    if (this.comprobarGanador()) {
      this.finalizarGanador();
    }
    if (this.comprobarPerdedor()) {
      this.finalizarPerdedor();
    }

    this.saveState();
  }

  comprobarPerdedor(): boolean {
    return this.numeroFallos >= 9;
  }

  analizarLetra(): void {
    if (this.juegoTerminado) return;
    const letra = this.recogerLetra();
    this.letraElegida = letra ? letra.toLowerCase() : '';
    if (this.letraElegida && this.letraElegida.length === 1) {
      if (this.letras.includes(this.letraElegida)) {
        this.comprobarLetras(this.letraElegida);
      } else {
        this.mostrarMensaje('El caracter ingresado no es una letra');
      }
    } else {
      this.mostrarMensaje('Por favor ingrese solo una letra');
    }
    this.letraElegida = '';
  }

  finalizarGanador(): void {
    this.panelGanador = true;
    this.juegoTerminado = true;
    this.toastr.success('¡GANASTE!', '¡FELICIDADES!');
    this.mostrarMensaje('GANADOR');
    this.clearState();

    this.modalTitle = '¡GANASTE!';
    this.modalIconClass = 'fas fa-trophy';
    this.modalIconColor = 'gold';
    const modal = new bootstrap.Modal(document.getElementById('resultadoModal')!);
    modal.show();
  }

  finalizarPerdedor(): void {
    this.panelPerdedor = true;
    this.juegoTerminado = true;
    this.toastr.error('¡PERDISTE!', 'LÁSTIMA!');
    this.mostrarMensaje('NO GANADOR');
    this.clearState();

    this.modalTitle = '¡PERDISTE!';
    this.modalIconClass = 'fas fa-sad-tear';
    this.modalIconColor = 'red';
    const modal = new bootstrap.Modal(document.getElementById('resultadoModal')!);
    modal.show();
  }

  reiniciarJuego(): void {
    this.reiniciarContador++;
    if (this.reiniciarContador % 3 === 0) {
      this.mostrarCambiarPalabra = true;
      return;
    }
    this.numeroFallos = 0;
    this.numeroAciertos = 0;
    this.mensaje = '';
    this.letrasUsadas.clear();
    this.panelGanador = false;
    this.panelPerdedor = false;
    this.juegoTerminado = false;
    this.palabraVisible = this.crearPalabraVisible(this.palabraOculta);
    this.actualizarPalabraVisible();
    this.saveState();
  }

  cambiarPalabra(): void {
    this.palabraOculta = this.crearPalabraOculta(this.palabrasPosibles);
    this.reiniciarContador = 0;
    this.mostrarCambiarPalabra = false;
    this.reiniciarJuego();
  }

  reloadPage(): void {
    window.location.reload();
  }

  actualizarPalabraVisible(): void {
    this.palabraVisible = this.palabraVisible;
  }

  goToPage(pageName: string): void {
    this.router.navigate([`${pageName}`]);
  }

  saveState(): void {
    const state = {
      palabraOculta: this.palabraOculta,
      palabraVisible: this.palabraVisible,
      numeroFallos: this.numeroFallos,
      numeroAciertos: this.numeroAciertos,
      juegoTerminado: this.juegoTerminado,
      panelGanador: this.panelGanador,
      panelPerdedor: this.panelPerdedor,
      letrasUsadas: Array.from(this.letrasUsadas)
    };
    localStorage.setItem('hangmanState', JSON.stringify(state));
  }

  clearState(): void {
    localStorage.removeItem('hangmanState');
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('resultadoModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  closeModalAndRestart(): void {
    this.cerrarModal();
    this.clearState();
    this.cambiarPalabra();
    this.reiniciarJuego();
  }
}
