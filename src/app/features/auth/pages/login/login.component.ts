import { Component } from '@angular/core';
import { WWInputComponent } from '../../../../shared/components/input/input.component';
import { InputLabelType, InputSize, InputValidState } from '../../../../shared/components/input/input.enums';
import { WWButtonComponent } from '../../../../shared/components/button/button.component';
import { ButtonSize, ButtonType } from '../../../../shared/components/button/button.enums';
import { WWTextareaComponent } from '../../../../shared/components/textarea/textarea.component';

@Component({
    standalone: true,
    imports: [WWInputComponent, WWButtonComponent, WWTextareaComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginPageComponent {
    login: string = '';

    protected readonly InputLabelType = InputLabelType;
    protected readonly InputSize = InputSize;
    protected readonly InputValidState = InputValidState;

    Login() {
        console.log('Login');
    }

    protected readonly ButtonSize = ButtonSize;
    protected readonly ButtonType = ButtonType;
}
