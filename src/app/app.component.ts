import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'amor';

  constructor(private updates: SwUpdate) {}

  ngOnInit() {
    this.registerServiceWorker();
    this.requestNotificationPermission();
    if (this.updates.isEnabled) {
      this.updates.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          if (confirm('Nueva versión disponible, ¿Deseas cargarla?')) {
            window.location.reload();
          }
        }
      });
    }
    this.scheduleCacheUpdate();
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('Service Worker registered:', registration);

        navigator.serviceWorker.addEventListener('message', event => {
          if (event.data && event.data.type === 'CACHE_UPDATED') {
            this.showUpdateNotification();
          }
        });
      }).catch(error => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }

  scheduleCacheUpdate() {
    const now = new Date();
    const hoursUntilMidnight = 24 - now.getHours();
    const minutesUntilMidnight = 60 - now.getMinutes();
    const secondsUntilMidnight = 60 - now.getSeconds();
    const millisecondsUntilMidnight = ((hoursUntilMidnight * 60 + minutesUntilMidnight) * 60 + secondsUntilMidnight) * 1000;

    setTimeout(() => {
      this.updateCache();
      setInterval(() => this.updateCache(), 24 * 60 * 60 * 1000);
    }, millisecondsUntilMidnight);
  }

  updateCache() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.update().then(() => {
            if (registration.waiting) {
              registration.waiting.postMessage({ action: 'skipWaiting' });
            }
          });
        });
      });
    }
  }

  showUpdateNotification() {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        const options: ExtendedNotificationOptions = {
          body: 'La aplicación se ha actualizado con éxito.',
          icon: '/assets/icons/icon-72x72.png',
          badge: '/assets/icons/icon-72x72.png',
          tag: 'cache-update-notification',
          renotify: true,
          vibrate: [200, 100, 200]
        };
        registration.showNotification('Aplicación Actualizada', options);
      });
    }
  }
}

interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  renotify: boolean;
}
