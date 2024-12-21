import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { AuthRoutes } from './auth.routes';

export const routes: Routes = [
    {
        path: "auth",
        component: AuthLayoutComponent,
        children: AuthRoutes
    }
];
