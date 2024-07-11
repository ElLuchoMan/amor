import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SwUpdate } from '@angular/service-worker';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig } from './environments/firebase-config';
import { initializeApp } from "firebase/app";
import { ToastrService } from 'ngx-toastr';
import { SongsService } from './services/songs.service';
import { MessagePayload } from 'firebase/messaging';
import { BehaviorSubject } from 'rxjs';
import { PostToken } from './models/token.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'amor';
  messaging = getMessaging(initializeApp(firebaseConfig));
  currentMessage = new BehaviorSubject<MessagePayload | null>(null);
  constructor(private toastr: ToastrService, private songService: SongsService, private http: HttpClient) { }
  token = '';
  user_id = this.songService.getUUID();

  ngOnInit() {
    this.user_id = this.songService.getUUID();
    this.registerServiceWorker();
    this.requestNotificationPermission();
    this.scheduleCacheUpdate();
    this.listenForMessages();
  }

  requestNotificationPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        this.subscribeToNotifications();
      } else {
        console.log('Notification permission denied.');
      }
    });
  }

  subscribeToNotifications() {
    getToken(this.messaging, { vapidKey: 'BI-L9JSRv9h8lb39CQYbnW5IBEx7MMGhn6x_Wbe1GF_XwXQ56fcGpRao0j8Ex-PkzwYMwr1JYJIP2qHPyZHeNjs' }).then((token) => {
      if (token) {
        this.songService.token = token;
        const postToken: PostToken = {
          token: token,
          user_id: this.user_id
        }
        this.songService.postToken(postToken).subscribe(response => {
          console.log('Token actualizado en el servidor:', response);
          this.getToken();
        }, error => {
          console.error('Error enviando token al servidor', error);
        });

      } else {
        console.log('No hay un token de registro disponible. Solicita permiso para generar uno.');
      }
    }).catch((err) => {
      console.log('Se produjo un error al recuperar el token.', err);
    });
  }

  getToken() {
    this.songService.getToken(this.user_id).subscribe(response => {
      this.token = response.token;
      console.log('Token recuperado correctamente');
    }, error => {
      console.error('Error recuperando token', error);
    });
  }

  listenForMessages() {
    onMessage(this.messaging, (payload: any) => {
      console.log('Message received. ', payload);
      this.toastr.info(payload.notification?.body, payload.notification?.title);
      this.showNotification(payload.notification.title, payload.notification?.body, payload.notification?.image);
      this.currentMessage.next(payload);
    });
  }

  showNotification(title: string, body: string, icon: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon });
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js').then(registration => {
        console.log('Service Worker registered');
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
}

