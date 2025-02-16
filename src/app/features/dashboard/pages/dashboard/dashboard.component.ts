import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ElementSize, ElementType } from '../../../../shared/enums/element-types.enums';
import { WWButtonComponent } from '../../../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { SprintCardComponent } from '../../../../shared/components/sprint-card/sprint-card.component';

@Component({
    standalone: true,
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    imports: [
        DatePipe,
        WWButtonComponent,
        RouterLink,
        SprintCardComponent
    ],
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    currentDate: Date = new Date();

    constructor(private authService: AuthService) {}

    get username(): string {
        let formattedUsername = this.authService.userStatus!.username;
        if (formattedUsername.length > 18) {
            formattedUsername = formattedUsername.slice(0, 18) + '...';
        }
        return formattedUsername;
    }

    getGreetings(): string {
        const hours = this.currentDate.getHours();

        if (hours >= 5 && hours < 12) {
            return 'Good morning';
        } else if (hours >= 12 && hours < 18) {
            return 'Good afternoon';
        } else if (hours >= 18 && hours < 22) {
            return 'Good evening';
        } else {
            return 'Good night';
        }
    }

    protected readonly ElementSize = ElementSize;
    protected readonly ElementType = ElementType;
}
