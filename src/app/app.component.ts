import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig } from './environments/firebase-config';
import { initializeApp } from "firebase/app";
import { ToastrService } from 'ngx-toastr';
import { SongsService } from './services/songs.service';
import { MessagePayload } from 'firebase/messaging';
import { BehaviorSubject } from 'rxjs';
import { PostToken } from './models/token.model';
import { ErrorLogModalComponent } from './components/error-log-modal/error-log-modal.component';
import { ErrorLoggingService } from './services/error-logging.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsModalComponent } from './components/news-modal/news-modal.component';
import { TokenService } from './services/token.service';
import { UUIDService } from './services/uuid.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NewsModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'amor';
  messaging = getMessaging(initializeApp(firebaseConfig));
  currentMessage = new BehaviorSubject<MessagePayload | null>(null);

  constructor(private toastr: ToastrService, private songService: SongsService,
    private errorLoggingService: ErrorLoggingService, private tokenService: TokenService, private uuidService: UUIDService, private modalService: NgbModal) { }

  token = '';
  user_id = this.uuidService.getUUID();

  ngOnInit() {
    this.user_id = this.uuidService.getUUID();
    this.registerServiceWorker();
    this.requestNotificationPermission();
    this.listenForMessages();
  }

  requestNotificationPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        this.subscribeToNotifications();
      } else {
        this.openModal('No se han otorgado permisos para notificaciones.');
      }
    });
  }

  subscribeToNotifications() {
    getToken(this.messaging, { vapidKey: 'BI-L9JSRv9h8lb39CQYbnW5IBEx7MMGhn6x_Wbe1GF_XwXQ56fcGpRao0j8Ex-PkzwYMwr1JYJIP2qHPyZHeNjs' }).then((token) => {
      if (token) {
        this.tokenService.token = token;
        const postToken: PostToken = {
          token: token,
          user_id: this.user_id
        };
        this.tokenService.postToken(postToken).subscribe(response => {
          this.getToken();
        }, error => {
          this.openModal(`Error enviando token al servidor: ${this.errorLoggingService.logError(error)}`);
        });
      } else {
        this.openModal('No hay un token de registro disponible. Solicita permiso para generar uno.');
      }
    }).catch((err) => {
      this.openModal(`Se produjo un error al recuperar el token: ${this.errorLoggingService.logError(err)}`);
    });
  }

  getToken() {
    this.tokenService.getToken(this.user_id).subscribe(response => {
      this.token = response.token;
    }, error => {
      this.openModal(`Error recuperando token: ${this.errorLoggingService.logError(error)}`);
    });
  }

  listenForMessages() {
    onMessage(this.messaging, (payload: any) => {
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
      }).catch(error => {
        this.openModal(`Service Worker registration failed: ${this.errorLoggingService.logError(error)}`);
      });
    }
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

  openModal(errorMessage: string): void {
    this.errorLoggingService.logError(errorMessage);
    const modalRef = this.modalService.open(ErrorLogModalComponent);
    modalRef.componentInstance.errors = this.errorLoggingService.getErrors();
  }
}
