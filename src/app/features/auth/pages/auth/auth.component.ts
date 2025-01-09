import { finalize, forkJoin } from 'rxjs';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertType } from '../../../../shared/components/alert/alert.enums';
import { AnimationTwoStep, AnimationVisibilityStep } from './animation-steps.enum';
import { ButtonSize, ButtonType } from '../../../../shared/components/button/button.enums';
import { WWAlertComponent } from '../../../../shared/components/alert/alert.component';
import { WWButtonComponent } from '../../../../shared/components/button/button.component';
import { WWInputComponent } from '../../../../shared/components/input/input.component';
import { WWTextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { WWPreloaderComponent } from '../../../../shared/components/preloader/preloader.component';
import { InputValidState } from '../../../../shared/components/input/input.enums';
import { AppDataService } from '../../../../core/services/app-data.service';
import { AppStatusModel } from '../../../../core/models/status.models';
import { passwordMatchValidator } from '../../../../core/validators/password-match.validator';
import { jsonValidator } from '../../../../core/validators/json.validator';
import { AuthService } from '../../../../core/services/auth.service';
import { BackupService } from '../../../../core/services/backup.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        NgOptimizedImage,
        NgTemplateOutlet,
        NgIf,
        ReactiveFormsModule,
        WWButtonComponent,
        WWInputComponent,
        WWAlertComponent,
        WWTextareaComponent,
        WWPreloaderComponent,
    ],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    animations: [
        trigger('authLogoAnimation', [
            state(AnimationTwoStep.Start, style({
                transform: 'scale(2)',
                top: '200px'
            })),
            state(AnimationTwoStep.Finish, style({
                transform: 'scale(1)',
                top: '0'
            })),
            transition(`${AnimationTwoStep.Start} <=> ${AnimationTwoStep.Finish}`, [
                animate('1000ms ease-in-out')
            ])
        ]),
        trigger('authErrorAnimation', [
            state(AnimationVisibilityStep.Hidden, style({
                'pointer-events': 'none',
                opacity: '0'
            })),
            state(AnimationVisibilityStep.Visible, style({
                'pointer-events': 'auto',
                opacity: '1'
            })),
            transition(`${AnimationVisibilityStep.Hidden} <=> ${AnimationVisibilityStep.Visible}`, [
                animate('400ms ease-in-out')
            ])
        ]),
        trigger('authPreloaderAnimation', [
            state(AnimationVisibilityStep.Hidden, style({
                'pointer-events': 'none',
                opacity: '0'
            })),
            state(AnimationVisibilityStep.Visible, style({
                'pointer-events': 'auto',
                opacity: '1'
            })),
            transition(`${AnimationVisibilityStep.Hidden} <=> ${AnimationVisibilityStep.Visible}`, [
                animate('400ms ease-in-out')
            ])
        ]),
        trigger('authFormAnimation', [
            state(AnimationVisibilityStep.Hidden, style({
                'pointer-events': 'none',
                'opacity': '0'
            })),
            state(AnimationVisibilityStep.Visible, style({
                'pointer-events': 'auto',
                'opacity': '1'
            })),
            transition(`${AnimationVisibilityStep.Hidden} <=> ${AnimationVisibilityStep.Visible}`, [
                animate('300ms ease-in-out')
            ])
        ]),
    ]
})
export class AuthComponent {
    serverConnected: boolean = false;
    isLoading: boolean = false;

    requestAlertType: AlertType = AlertType.Danger;
    requestAlertMessage: string = ' ';

    loginForm: FormGroup;
    registrationForm: FormGroup;
    importForm: FormGroup;

    @ViewChild('loginFormBlock') loginFormBlock!: TemplateRef<any>;
    @ViewChild('registerFormBlock') registerFormBlock!: TemplateRef<any>;
    @ViewChild('importFormBlock') importFormBlock!: TemplateRef<any>;

    loadedBlockRef!: TemplateRef<any>;
    formState: AnimationVisibilityStep = AnimationVisibilityStep.Hidden;

    loadingState: AnimationTwoStep = AnimationTwoStep.Start;
    connectionErrorState: AnimationVisibilityStep = AnimationVisibilityStep.Hidden;
    requestAlertState: AnimationVisibilityStep = AnimationVisibilityStep.Hidden;
    preloaderState: AnimationVisibilityStep = AnimationVisibilityStep.Hidden;

    protected readonly AlertType = AlertType;
    protected readonly ButtonSize = ButtonSize;
    protected readonly ButtonType = ButtonType;

    constructor(
        private formBuilder: FormBuilder,
        private appDataService: AppDataService,
        private authService: AuthService,
        private backupService: BackupService
    ) {
        this.loginForm = this.formBuilder.group({
            Username: [
                '',
                [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
            ],
            Password: [
                '',
                [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
            ]
        });
        this.registrationForm = this.formBuilder.group(
            {
                Username: [
                    '',
                    [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
                ],
                Password: [
                    '',
                    [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
                ],
                RepeatPassword: [
                    '',
                    [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
                ]
            },
            { validators: passwordMatchValidator() }
        );
        this.importForm = this.formBuilder.group({
            ImportData: [
                '',
                [Validators.required, jsonValidator()],
            ]
        });
    }

    get appStatus(): AppStatusModel | null {
        return this.appDataService.appStatus;
    }

    get passwordMismatch(): boolean {
        return this.registrationForm.errors?.['passwordMismatch'];
    }

    ngAfterViewInit() {
        forkJoin({
            AppStatus: this.appDataService.getAppStatus(),
            BackgroundStatus: this.appDataService.getBackgroundStatus()
        }).subscribe({
            next: (results) => {
                if (
                    results.AppStatus?.appName == 'WinterWay-Server' &&
                    results.BackgroundStatus?.appName == 'WinterWay-Images'
                ) {
                    this.getUserStatus();
                    return;
                }
                this.connectionErrorState = AnimationVisibilityStep.Visible;
            },
            error: () => {
                this.connectionErrorState = AnimationVisibilityStep.Visible;
            }
        })
    }

    loadBlock(targetBlock: TemplateRef<any>) {
        this.formState = AnimationVisibilityStep.Hidden;
        this.requestAlertState = AnimationVisibilityStep.Hidden;
        this.requestAlertMessage = ' ';
        this.loginForm.reset();
        this.registrationForm.reset();
        this.importForm.reset();
        setTimeout(() => {
            this.loadedBlockRef = targetBlock;
            this.formState = AnimationVisibilityStep.Visible;
        }, 400);
    }

    checkFieldValidity(form: FormGroup, fieldName: string, additionalFactor: boolean = false): InputValidState {
        const targetField = form.controls[fieldName];
        if (targetField.touched && (targetField.invalid || additionalFactor)) {
            return InputValidState.Invalid;
        }
        return InputValidState.None;
    }

    startLoading() {
        this.isLoading = true;
        this.requestAlertMessage = ' ';
        this.requestAlertState = AnimationVisibilityStep.Hidden;
        this.preloaderState = AnimationVisibilityStep.Visible;
        this.loginForm.disable();
        this.registrationForm.disable();
        this.importForm.disable();
    }

    finishLoading() {
        this.isLoading = false;
        this.preloaderState = AnimationVisibilityStep.Hidden;
        this.loginForm.enable();
        this.registrationForm.enable();
        this.importForm.enable();
    }

    loginClick() {
        const formIsInvalid = this.loginForm.invalid;

        if (formIsInvalid) {
            this.onErrorAlert('Incorrect login or password');
            return;
        }

        this.startLoading();

        this.authService.login(this.loginForm.value)
            .pipe(
                finalize(() => {
                    this.finishLoading();
                })
            )
            .subscribe({
                next: (response) => {
                    // TODO Redirect to the system
                    console.log('LOGGED');
                    console.log(response);
                },
                error: (err) => {
                    this.onErrorAlert(err?.error?.errorMessage);
                }
            });
    }

    registrationClick() {
        const formIsInvalid = this.registrationForm.invalid;

        if (formIsInvalid) {
            this.onErrorAlert('Incorrect data. Username and password must be at least 6 and no more than 40 characters long. The entered passwords must match.');
            return;
        }

        this.startLoading();

        this.authService.registration(this.registrationForm.value)
            .pipe(
                finalize(() => {
                    this.finishLoading();
                })
            )
            .subscribe({
                next: () => {
                    const username = this.registrationForm.value.Username;
                    this.getAppStatus();
                    this.loadBlock(this.loginFormBlock);
                    this.onSuccessAlert(`User \"${username}\" has been successfully registered`);
                },
                error: (err) => {
                    this.onErrorAlert(err?.error?.errorMessage);
                }
            });
    }

    importClick() {
        const formIsInvalid = this.importForm.invalid;

        if (formIsInvalid) {
            this.onErrorAlert('Incorrect data format');
            return;
        }

        this.startLoading();

        this.backupService.import(this.importForm.value?.['ImportData'])
            .pipe(
                finalize(() => {
                    this.finishLoading();
                })
            )
            .subscribe({
                next: (response) => {
                    const username = response.operation.split('|')[1];
                    this.getAppStatus();
                    this.loadBlock(this.loginFormBlock);
                    this.onSuccessAlert(`User \"${username}\" has been successfully imported`);
                },
                error: (err) => {
                    this.onErrorAlert(err?.error?.errorMessage);
                }
            });
    }

    getAppStatus() {
        this.appDataService.getAppStatus().subscribe({
            error: () => {
                this.connectionErrorState = AnimationVisibilityStep.Visible;
            }
        });
    }

    getUserStatus() {
        this.authService.getUserStatus().subscribe({
            next: (response) => {
                console.log('AUTH');
                // todo redirect to the system
            },
            error: (err) => {
                console.log('NOT AUTH')
                this.onConnectionEstablished();
            }
        })
    }

    onSuccessAlert(message: string = 'Success'): void {
        this.requestAlertType = AlertType.Success;
        this.requestAlertMessage = message;
        this.requestAlertState = AnimationVisibilityStep.Visible;
    }

    onErrorAlert(message: string = 'Server error'): void {
        this.requestAlertType = AlertType.Danger;
        this.requestAlertMessage = message;
        this.requestAlertState = AnimationVisibilityStep.Visible;
    }

    onConnectionEstablished() {
        this.serverConnected = true;
        this.loadedBlockRef = this.loginFormBlock;
        this.loadingState = AnimationTwoStep.Finish;
        setTimeout(() => {
            this.formState = AnimationVisibilityStep.Visible;
        }, 1100)
    }
}
