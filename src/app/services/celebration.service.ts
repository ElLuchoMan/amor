import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CelebrationEvent {
  type: 'birthday' | 'anniversary' | 'special' | 'custom';
  message?: string;
  duration?: number;
  balloonCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CelebrationService {
  private showBalloonsSubject = new BehaviorSubject<boolean>(false);
  private celebrationEventSubject = new BehaviorSubject<CelebrationEvent | null>(null);

  constructor(private router: Router) { }

  // Observable para que los componentes se suscriban
  get showBalloons$(): Observable<boolean> {
    return this.showBalloonsSubject.asObservable();
  }

  get celebrationEvent$(): Observable<CelebrationEvent | null> {
    return this.celebrationEventSubject.asObservable();
  }

  // Métodos públicos para activar celebraciones
  triggerBirthdayCelebration(message?: string) {
    if (!this.isAllowedRoute()) return;
    
    this.triggerCelebration({
      type: 'birthday',
      message: message || '🎉 ¡Feliz Cumpleaños! 🎉',
      duration: 10000,
      balloonCount: 20 // 5 globos más como mencionaste
    });
  }

  triggerAnniversaryCelebration(message?: string) {
    if (!this.isAllowedRoute()) return;
    
    this.triggerCelebration({
      type: 'anniversary',
      message: message || '🎊 ¡Feliz Aniversario! 🎊',
      duration: 8000,
      balloonCount: 23 // 5 globos más
    });
  }

  triggerSpecialCelebration(message?: string) {
    if (!this.isAllowedRoute()) return;
    
    this.triggerCelebration({
      type: 'special',
      message: message || '✨ ¡Celebremos! ✨',
      duration: 6000,
      balloonCount: 15 // 5 globos más
    });
  }

  triggerCustomCelebration(event: CelebrationEvent) {
    if (!this.isAllowedRoute()) return;
    
    this.triggerCelebration(event);
  }

  // Método privado para activar cualquier celebración
  private triggerCelebration(event: CelebrationEvent) {
    this.celebrationEventSubject.next(event);
    this.showBalloonsSubject.next(true);
    
    // Auto-hide después de la duración especificada
    setTimeout(() => {
      this.hideBalloons();
    }, event.duration || 6000);
  }

  // Ocultar globos manualmente
  hideBalloons() {
    this.showBalloonsSubject.next(false);
    this.celebrationEventSubject.next(null);
  }

  // Método para verificar si es cumpleaños (ejemplo con fecha específica)
  checkForBirthday(birthdayDate: Date): boolean {
    const today = new Date();
    return today.getMonth() === birthdayDate.getMonth() && 
           today.getDate() === birthdayDate.getDate();
  }

  // Método para verificar fechas especiales del año
  checkForSpecialDates(): CelebrationEvent | null {
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth() retorna 0-11
    const day = today.getDate();

    // Fechas especiales personalizadas y otras importantes
    const specialDates: { [key: string]: CelebrationEvent } = {
      // Fechas personalizadas específicas
      '9-16': {
        type: 'birthday',
        message: '🎂 ¡Feliz Cumpleaños! 🎂',
        duration: 12000,
        balloonCount: 25
      },
      '3-16': {
        type: 'anniversary',
        message: '💕 ¡Feliz Aniversario! 💕',
        duration: 10000,
        balloonCount: 23 // 5 globos más
      },
      // Otras fechas especiales
      '1-1': {
        type: 'special',
        message: '🎊 ¡Feliz Año Nuevo! 🎊',
        duration: 12000,
        balloonCount: 25 // 5 globos más
      },
      '2-14': {
        type: 'special',
        message: '💕 ¡Feliz Día del Amor y la Amistad! 💕',
        duration: 8000,
        balloonCount: 17 // 5 globos más
      },
      '12-25': {
        type: 'special',
        message: '🎄 ¡Feliz Navidad! 🎄',
        duration: 10000,
        balloonCount: 20 // 5 globos más
      },
      '12-31': {
        type: 'special',
        message: '🎆 ¡Feliz Nochevieja! 🎆',
        duration: 10000,
        balloonCount: 23 // 5 globos más
      }
    };

    const dateKey = `${month}-${day}`;
    return specialDates[dateKey] || null;
  }

  // Verificar si estamos en una ruta donde se deben mostrar los globos
  private isAllowedRoute(): boolean {
    const currentUrl = this.router.url;
    const allowedRoutes = [
      '/', // Home
      '/home', // Home alternativo
      '/letter/16%2F09%2F2025' // Fecha específica URL encoded
    ];
    
    return allowedRoutes.includes(currentUrl);
  }

  // Método para activar celebración automática si es fecha especial
  checkAndTriggerSpecialDate() {
    // Solo activar si estamos en una ruta permitida
    if (!this.isAllowedRoute()) {
      return false;
    }
    
    const specialEvent = this.checkForSpecialDates();
    if (specialEvent) {
      this.triggerCustomCelebration(specialEvent);
      return true;
    }
    return false;
  }

  // Método para programar una celebración futura
  scheduleCelebration(date: Date, event: CelebrationEvent) {
    const now = new Date().getTime();
    const targetTime = date.getTime();
    const delay = targetTime - now;

    if (delay > 0) {
      setTimeout(() => {
        this.triggerCustomCelebration(event);
      }, delay);
    }
  }
}
