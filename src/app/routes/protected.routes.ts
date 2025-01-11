import { Routes } from '@angular/router';
import { DashboardComponent} from '../features/auth/pages/dashboard/dashboard.component';
import { BoardsComponent } from '../features/auth/pages/boards/boards.component';
import { Error404Component } from '../features/auth/pages/error-404/error-404.component';

export const protectedRoutes: Routes = [
    {
        path: "",
        component: DashboardComponent
    },
    {
        path: "boards",
        component: BoardsComponent
    },
    {
        path: "**",
        component: Error404Component
    }
];
