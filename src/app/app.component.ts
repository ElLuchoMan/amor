import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SongsService } from './services/songs.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'amor';
  readonly publicVapidKey = 'BI4YQ9kIan2m3EqyM0dFx3PYBUF3Ih3SMTdsqWWW--pClBQK9wywpAKI2smlpJyk4g9pRN22bUM54lrgzTZ8DQ4';

  constructor(private songsService: SongsService) {}

  ngOnInit(): void {
    this.requestPermissionAndSubscribeToPush();
  }

  private async requestPermissionAndSubscribeToPush(): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        try {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey)
          });

          this.songsService.sendSubscriptionToServer(subscription).subscribe({
            next: () => console.log('Suscripción enviada al servidor.'),
            error: (err) => console.error('Error al enviar la suscripción al servidor:', err)
          });
        } catch (err) {
          console.error('Fallo al suscribirse a las notificaciones push:', err);
        }
        Notification.requestPermission().then(function(permission) {
          console.log('Notification permission:', permission);
        });
        
      }
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
