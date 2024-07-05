import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'amor';

  ngOnInit() {
    this.scheduleCacheUpdate();
  }

  scheduleCacheUpdate() {
    const now = new Date();
    const hoursUntilMidnight = 24 - now.getHours();
    const minutesUntilMidnight = 60 - now.getMinutes();
    const secondsUntilMidnight = 60 - now.getSeconds();
    const millisecondsUntilMidnight = ((hoursUntilMidnight * 60 + minutesUntilMidnight) * 60 + secondsUntilMidnight) * 1000;

    setTimeout(() => {
      this.updateCache();
      setInterval(this.updateCache, 24 * 60 * 60 * 1000);
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
