import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HelloComponent } from './components/hello/hello.component';
import { SongsComponent } from './components/songs/songs.component';
import { SayYesComponent } from './components/say-yes/say-yes.component';
import { TristezaComponent } from './components/tristeza/tristeza.component';

// Definir una constante para las rutas
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hello', component: HelloComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'say-yes', component: SayYesComponent },
  { path: 'no-estes-triste', component: TristezaComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export const routes = appRoutes;
