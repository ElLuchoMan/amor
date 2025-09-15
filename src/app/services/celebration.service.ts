import { Injectable } from '@angular/core';
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

  constructor() { }

  // Observable para que los componentes se suscriban
  get showBalloons$(): Observable<boolean> {
    return this.showBalloonsSubject.asObservable();
  }

  get celebrationEvent$(): Observable<CelebrationEvent | null> {
    return this.celebrationEventSubject.asObservable();
  }

  // Métodos públicos para activar celebraciones
  triggerBirthdayCelebration(message?: string) {
    this.triggerCelebration({
      type: 'birthday',
      message: message || '🎉 ¡Feliz Cumpleaños! 🎉',
      duration: 10000,
      balloonCount: 15
    });
  }

  triggerAnniversaryCelebration(message?: string) {
    this.triggerCelebration({
      type: 'anniversary',
      message: message || '🎊 ¡Feliz Aniversario! 🎊',
      duration: 8000,
      balloonCount: 12
    });
  }

  triggerSpecialCelebration(message?: string) {
    this.triggerCelebration({
      type: 'special',
      message: message || '✨ ¡Celebremos! ✨',
      duration: 6000,
      balloonCount: 10
    });
  }

  triggerCustomCelebration(event: CelebrationEvent) {
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
      '9-14': {
        type: 'birthday',
        message: '🎂 ¡Feliz Cumpleaños! 🎂',
        duration: 12000,
        balloonCount: 20
      },
      '3-16': {
        type: 'anniversary',
        message: '💕 ¡Feliz Aniversario! 💕',
        duration: 10000,
        balloonCount: 18
      },
      // Otras fechas especiales
      '1-1': {
        type: 'special',
        message: '🎊 ¡Feliz Año Nuevo! 🎊',
        duration: 12000,
        balloonCount: 20
      },
      '2-14': {
        type: 'special',
        message: '💕 ¡Feliz Día del Amor y la Amistad! 💕',
        duration: 8000,
        balloonCount: 12
      },
      '12-25': {
        type: 'special',
        message: '🎄 ¡Feliz Navidad! 🎄',
        duration: 10000,
        balloonCount: 15
      },
      '12-31': {
        type: 'special',
        message: '🎆 ¡Feliz Nochevieja! 🎆',
        duration: 10000,
        balloonCount: 18
      }
    };

    const dateKey = `${month}-${day}`;
    return specialDates[dateKey] || null;
  }

  // Método para activar celebración automática si es fecha especial
  checkAndTriggerSpecialDate() {
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
