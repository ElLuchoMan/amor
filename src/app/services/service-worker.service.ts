import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {

  registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      return navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(() => {
          return Promise.resolve();
        })
        .catch(error => {
          return Promise.reject(new Error(`Service Worker registration failed: ${error.message}`));
        });
    }
    return Promise.resolve();
  }

  updateCache(): Promise<void> {
    if ('serviceWorker' in navigator) {
      return navigator.serviceWorker.getRegistrations().then(registrations => {
        return Promise.all(registrations.map(registration => {
          return registration.update().then(() => {
            if (registration.waiting) {
              registration.waiting.postMessage({ action: 'skipWaiting' });
            }
          });
        })).then(() => { });
      });
    }
    return Promise.resolve();
  }
}
