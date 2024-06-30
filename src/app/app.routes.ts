import { Routes } from '@angular/router';
import { HelloComponent } from './components/hello/hello.component';
import { SongsComponent } from './components/songs/songs.component';
import { SayYesComponent } from './components/say-yes/say-yes.component';
import { TristezaComponent } from './components/tristeza/tristeza.component';

export const routes: Routes = [
    { path: '', component: HelloComponent },
    { path: 'hello', component: HelloComponent },
    { path: 'songs', component: SongsComponent },
    { path: 'say-yes', component: SayYesComponent },
    { path: 'no-estes-triste', component: TristezaComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
