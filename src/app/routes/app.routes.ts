import { Routes } from '@angular/router';
import { protectedRoutes } from './protected.routes';
import { AuthGuard } from '../core/guards/auth.guard';
import { NonAuthGuard} from '../core/guards/non-auth.guard';
import { AuthComponent } from '../features/auth/pages/auth/auth.component';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { Error404Component } from '../features/errors/pages/error-404/error-404.component';

export const routes: Routes = [
    {
        path: "auth",
        component: AuthComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: "",
        component: MainLayoutComponent,
        children: protectedRoutes,
        canActivate: [AuthGuard]
    },
    {
        path: "**",
        component: Error404Component,
        canActivate: [NonAuthGuard]
    },
];
