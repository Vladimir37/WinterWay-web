import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { finalize } from 'rxjs';
import { InputValidState } from '../../../shared/components/input/input.enums';

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
        WWRadioComponent,
        NgTemplateOutlet
    ],
    styleUrl: './user-modal.component.scss'
})
export class UserModalComponent {
    isLoading: boolean = false;

    activeTab: number = 0;

    @ViewChild('editUser') editUserBlock!: TemplateRef<any>;
    @ViewChild('changePassword') changePasswordBlock!: TemplateRef<any>;

    availableTabs: RadioElement[] = [
        {
            value: 0,
            title: 'Edit user settings'
        },
        {
            value: 1,
            title: 'Change password'
        },
    ]
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
                this.authService.userStatus?.themeType,
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

    get formBlockRef(): TemplateRef<any> {
        if (this.activeTab === 0) {
            return this.editUserBlock;
        }
        return this.changePasswordBlock;
    }

    get repeatPasswordValidState(): InputValidState {
        const isTheSame = this.validationService.checkPasswordMatch(this.changePasswordForm, 'RepeatPassword');
        return this.validationService.checkFieldValidity(this.changePasswordForm, 'RepeatPassword', isTheSame === InputValidState.Invalid);
    }

    get repeatPasswordValidationMessage(): string {
        if (this.validationService.checkPasswordMatch(this.changePasswordForm, 'RepeatPassword') === InputValidState.Invalid) {
            return 'Both passwords must be the same';
        }
        return 'Please enter between 6 and 40 characters';
    }

    submitClick() {
        if (this.activeTab === 0) {
            return this.editUserClick();
        }
        return this.changePasswordClick();
    }

    toggleLoadingStatus(status: boolean) {
        this.isLoading = status;
        if (!status) {
            this.editUserForm.enable();
            this.changePasswordForm.enable();
        } else {
            this.editUserForm.disable();
            this.changePasswordForm.disable();
        }
    }

    editUserClick() {
        if (this.editUserForm.invalid) {
            this.toastService.createWarningToast('Incorrect data.', 'Make sure to complete the form properly');
            return;
        }

        this.toggleLoadingStatus(true);

        this.authService.editUser(this.editUserForm.value).pipe(
            finalize(() => {
                this.toggleLoadingStatus(false);
            })
        ).subscribe({
            next: () => {
                this.bsModalRef.hide();
                this.authService.getUserStatus().subscribe();
                this.toastService.createSuccessToast('Success', 'User data has been successfully updated');
            },
            error: () => {
                this.toastService.createErrorToast('Error', 'Please, try again later');
            }
        });
    }

    changePasswordClick() {
        if (this.changePasswordForm.invalid) {
            this.toastService.createWarningToast('Incorrect data.', 'Make sure to complete the form properly');
            return;
        }

        this.toggleLoadingStatus(true);

        this.authService.changePassword(this.changePasswordForm.value).pipe(
            finalize(() => {
                this.toggleLoadingStatus(false);
            })
        ).subscribe({
            next: () => {
                this.bsModalRef.hide();
                this.toastService.createSuccessToast('Success', 'Password has been successfully changed');
            },
            error: (err) => {
                this.toastService.createErrorToast('Error', err?.error?.errorMessage ?? 'Please, try again later');
            }
        });
    }
}
