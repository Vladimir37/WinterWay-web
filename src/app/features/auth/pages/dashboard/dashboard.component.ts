import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    imports: [
        RouterLink
    ],
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    //
}
