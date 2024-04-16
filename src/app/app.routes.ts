import { Routes } from '@angular/router';
import { HelloComponent } from './components/hello/hello.component';
import { SongsComponent } from './components/songs/songs.component';

export const routes: Routes = [
    { path: 'hello', component: HelloComponent },
    { path:'songs', component: SongsComponent},
    { path: '**', redirectTo: '/hello' },
];
