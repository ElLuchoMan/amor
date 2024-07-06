import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsService } from '../../services/songs.service';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../environments/firebase-config';
import { ToastrService } from 'ngx-toastr';
interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  navLinks: NavLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Hello', path: '/hello' },
    { label: 'Canciones', path: '/songs' },
    { label: 'Pregunta', path: '/say-yes' },
    { label: 'No Estés Triste', path: '/no-estes-triste' },
  ];

  token: string | null = null;
  messaging = getMessaging(initializeApp(firebaseConfig));
  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
    this.subscribeToNotifications();
  }
  subscribeToNotifications() {
    getToken(this.messaging, { vapidKey: 'BI-L9JSRv9h8lb39CQYbnW5IBEx7MMGhn6x_Wbe1GF_XwXQ56fcGpRao0j8Ex-PkzwYMwr1JYJIP2qHPyZHeNjs' }).then((token) => {
      if (token) {
        this.token = token;
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
  }

  copyTokenToClipboard() {
    if (this.token) {
      navigator.clipboard.writeText(this.token).then(() => {
        console.log('Token copied to clipboard!');
        this.toastr.success('Copiado al portapapeles', undefined);
      }).catch(err => {
        console.error('Could not copy token: ', err);
      });
    }
  }
}
