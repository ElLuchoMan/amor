import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HelloComponent } from './pages/hello/hello.component';
import { SongsComponent } from './pages/songs/songs.component';
import { SayYesComponent } from './pages/say-yes/say-yes.component';
import { TristezaComponent } from './pages/tristeza/tristeza.component';
import { LettersPageComponent } from './pages/letters-page/letters-page.component';
import { LetterDetailComponent } from './components/letter-detail/letter-detail.component';
import { SpaceInvadersPageComponent } from './pages/space-invaders/space-invaders.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hello', component: HelloComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'say-yes', component: SayYesComponent },
  { path: 'no-estes-triste', component: TristezaComponent },
  { path: 'letters', component: LettersPageComponent },
  { path: 'letter/:date', component: LetterDetailComponent },
  { path: 'space-invaders', component: SpaceInvadersPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export const routes = appRoutes;
