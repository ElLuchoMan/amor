import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tristeza',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tristeza.component.html',
  styleUrls: ['./tristeza.component.scss']
})
export class TristezaComponent {
  palabrasPosibles: string[] = ["coffie", "milu", "natalia", "mia", "amorcito", "alejandro", "betty"];
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

  constructor() {
    this.palabraOculta = this.crearPalabraOculta(this.palabrasPosibles);
    this.palabraVisible = this.crearPalabraVisible(this.palabraOculta);
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
  }

  finalizarPerdedor(): void {
    this.panelPerdedor = true;
    this.juegoTerminado = true;
    this.toastr.error('¡PERDISTE!', 'LÁSTIMA!');
  }

  reloadPage(): void {
    window.location.reload();
  }

  actualizarPalabraVisible(): void {
    this.palabraVisible = this.palabraVisible;
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
