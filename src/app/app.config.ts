import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { firebaseConfig } from './environments/firebase-config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    })),
    importProvidersFrom(RouterModule.forRoot(routes)),
    importProvidersFrom(ServiceWorkerModule.register('service-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000'
    })),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideMessaging(() => getMessaging())
  ]
};
