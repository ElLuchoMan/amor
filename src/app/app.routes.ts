import { Routes } from '@angular/router';
import { HelloComponent } from './hello/hello.component';

export const routes: Routes = [
    {path:'', component: HelloComponent},
    {path: '**', redirectTo:'/hello'}
];
