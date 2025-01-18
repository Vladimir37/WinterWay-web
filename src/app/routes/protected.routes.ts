import { Routes } from '@angular/router';
import { DashboardComponent} from '../features/dashboard/pages/dashboard/dashboard.component';
import { BoardsComponent } from '../features/boards/pages/boards/boards.component';
import { Error404Component } from '../features/errors/pages/error-404/error-404.component';

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
