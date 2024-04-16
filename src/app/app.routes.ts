import { Routes } from '@angular/router';
import { HelloComponent } from './components/hello/hello.component';

export const routes: Routes = [
    { path: 'hello', component: HelloComponent },
    { path: '**', redirectTo: '/hello' }
];
