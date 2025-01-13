import { Component, forwardRef } from '@angular/core';
import { NgIf } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserStatusModel } from '../../../core/models/status.models';
import { WWButtonComponent } from '../../../shared/components/button/button.component';
import { WWPreloaderComponent } from '../../../shared/components/preloader/preloader.component';
import { WWInputComponent } from '../../../shared/components/input/input.component';
import { WWRadioComponent } from '../../../shared/components/radio/radio.component';
import { ElementSize, ElementType } from '../../../shared/enums/element-types.enums';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ValidationService } from '../../../core/services/validation.service';
import { RadioElement } from '../../../shared/components/radio/radio.model';
import { passwordMatchValidator } from '../../../core/validators/password-match.validator';

@Component({
    standalone: true,
    selector: 'user-modal',
    templateUrl: './user-modal.component.html',
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        WWButtonComponent,
        WWPreloaderComponent,
        WWInputComponent,
        WWRadioComponent
    ],
    styleUrl: './user-modal.component.scss'
})
export class UserModalComponent {
    isLoadingEditUser: boolean = false;
    isLoadingChangePassword: boolean = false;
    defaultAutocompleteOptions: RadioElement[] = [
        {
            value: false,
            title: 'Disabled'
        },
        {
            value: true,
            title: 'Enabled'
        }
    ]

    themeOptions: RadioElement[] = [
        {
            value: 0,
            title: 'Light'
        },
        {
            value: 1,
            title: 'Dark'
        }
    ]

    editUserForm: FormGroup;
    changePasswordForm: FormGroup;

    protected readonly ElementType = ElementType;
    protected readonly ElementSize = ElementSize;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private toastService: ToastService,
        public validationService: ValidationService,
        public bsModalRef: BsModalRef
    ) {
        this.editUserForm = this.formBuilder.group({
            Username: [
                this.authService.userStatus?.username,
                [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
            ],
            AutoCompleteTasks: [
                this.authService.userStatus?.defaultAutocomplete,
                [Validators.required],
            ],
            Theme: [
                0,
                [Validators.required],
            ],
        });
        this.changePasswordForm = this.formBuilder.group(
            {
                OldPassword: [
                    '',
                    [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
                ],
                NewPassword: [
                    '',
                    [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
                ],
                RepeatPassword: [
                    '',
                    [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
                ]
            },
            { validators: passwordMatchValidator('NewPassword', 'RepeatPassword') }
        );
    }

    get user(): UserStatusModel {
        return this.authService.userStatus!;
    }

    editUser() {
        if (this.editUserForm.invalid) {
            this.toastService.createErrorToast('Incorrect data.', 'Make sure to complete the form properly');
            return;
        }

        this.isLoadingEditUser = true;
    }

    changePassword() {
        if (this.editUserForm.invalid) {
            this.toastService.createErrorToast('Incorrect data.', 'Make sure to complete the form properly');
            return;
        }

        this.isLoadingChangePassword = true;
    }
}
