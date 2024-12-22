import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { WWAlertComponent } from '../../shared/components/alert/alert.component';
import { AlertType } from '../../shared/components/alert/alert.enums';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NgOptimizedImage,
        WWAlertComponent
    ],
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
    serverError: boolean = false;
    serverConnected: boolean = false;
    protected readonly AlertType = AlertType;
}
