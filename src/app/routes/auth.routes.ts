import { Routes } from "@angular/router";
import { LoginPageComponent } from '../features/auth/pages/login/login.component';

export const AuthRoutes: Routes = [
    {
        path: '',
        component: LoginPageComponent,
    }
]
