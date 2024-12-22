import { Component } from '@angular/core';
import { WWInputComponent } from '../../../../shared/components/input/input.component';
import { WWButtonComponent } from '../../../../shared/components/button/button.component';
import { ButtonSize, ButtonType } from '../../../../shared/components/button/button.enums';
import { AlertType } from '../../../../shared/components/alert/alert.enums';
import { WWAlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
    standalone: true,
    imports: [WWInputComponent, WWButtonComponent, WWAlertComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginPageComponent {
    login: string = '';
    password: string = '';

    protected readonly ButtonSize = ButtonSize;
    protected readonly ButtonType = ButtonType;

    Login() {
        console.log('Login');
    }

    protected readonly AlertType = AlertType;
}
