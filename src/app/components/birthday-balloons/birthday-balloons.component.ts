import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CelebrationService } from '../../services/celebration.service';

@Component({
  selector: 'app-birthday-balloons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './birthday-balloons.component.html',
  styleUrls: ['./birthday-balloons.component.scss']
})
export class BirthdayBalloonsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() show: boolean = false;
  @Input() duration: number = 10000; // Duración en ms
  @Input() balloonCount: number = 15; // Número de globos
  @Input() celebrationMessage: string = '';
  
  balloons: any[] = [];
  private timeoutId?: number;

  constructor(private celebrationService: CelebrationService) {}

  ngOnInit() {
    // Solo configuración inicial
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].currentValue === true) {
      // Limpiar timeout anterior si existe
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      // Cada vez que show cambie a true, generar nuevos globos
      this.generateBalloons();
      this.autoHide();
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  generateBalloons() {
    this.balloons = [];
    const colors = [
      '#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F06292',
      '#AED581', '#FFD54F', '#FF8A65', '#81C784',
      '#64B5F6', '#F48FB1', '#A1C4FD'
    ];

    for (let i = 0; i < this.balloonCount; i++) {
      this.balloons.push({
        id: i,
        color: colors[i % colors.length],
        left: Math.random() * 100, // Posición horizontal aleatoria
        delay: Math.random() * 2, // Delay aleatorio para la animación
        size: 0.8 + Math.random() * 0.4, // Tamaño aleatorio entre 0.8 y 1.2
        duration: 8 + Math.random() * 4 // Duración de animación aleatoria
      });
    }
  }

  private autoHide() {
    this.timeoutId = window.setTimeout(() => {
      this.celebrationService.hideBalloons();
    }, this.duration);
  }

  hideBalloons() {
    this.celebrationService.hideBalloons();
  }
}
