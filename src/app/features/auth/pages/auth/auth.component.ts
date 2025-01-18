import { finalize, forkJoin } from 'rxjs';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertType } from '../../../../shared/components/alert/alert.enums';
import { AnimationTwoStep } from '../../../../core/enums/animation-steps.enum';
import { ElementSize, ElementType } from '../../../../shared/enums/element-types.enums';
import { WWAlertComponent } from '../../../../shared/components/alert/alert.component';
import { WWButtonComponent } from '../../../../shared/components/button/button.component';
import { WWInputComponent } from '../../../../shared/components/input/input.component';
import { WWTextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { WWPreloaderComponent } from '../../../../shared/components/preloader/preloader.component';
import { AppDataService } from '../../../../core/services/app-data.service';
import { AppStatusModel } from '../../../../core/models/status.models';
import { passwordMatchValidator } from '../../../../core/validators/password-match.validator';
import { jsonValidator } from '../../../../core/validators/json.validator';
import { AuthService } from '../../../../core/services/auth.service';
import { BackupService } from '../../../../core/services/backup.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { PreloadService } from '../../../../core/services/preload.service';
import { ThemeService } from '../../../../core/services/theme.service';

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
            state(AnimationTwoStep.First, style({
                'transform': 'scale(2)',
                'top': '200px'
            })),
            state(AnimationTwoStep.Second, style({
                'transform': 'scale(1)',
                'top': '0'
            })),
            transition(`${AnimationTwoStep.First} <=> ${AnimationTwoStep.Second}`, [
                animate('1000ms ease-in-out')
            ])
        ]),
        trigger('authErrorAnimation', [
            state(AnimationTwoStep.First, style({
                'pointer-events': 'none',
                'opacity': '0'
            })),
            state(AnimationTwoStep.Second, style({
                'pointer-events': 'auto',
                'opacity': '1'
            })),
            transition(`${AnimationTwoStep.First} <=> ${AnimationTwoStep.Second}`, [
                animate('400ms ease-in-out')
            ])
        ]),
        trigger('authPreloaderAnimation', [
            state(AnimationTwoStep.First, style({
                'pointer-events': 'none',
                'opacity': '0'
            })),
            state(AnimationTwoStep.Second, style({
                'pointer-events': 'auto',
                'opacity': '1'
            })),
            transition(`${AnimationTwoStep.First} <=> ${AnimationTwoStep.Second}`, [
                animate('400ms ease-in-out')
            ])
        ]),
        trigger('authFormAnimation', [
            state(AnimationTwoStep.First, style({
                'pointer-events': 'none',
                'opacity': '0'
            })),
            state(AnimationTwoStep.Second, style({
                'pointer-events': 'auto',
                'opacity': '1'
            })),
            transition(`${AnimationTwoStep.First} <=> ${AnimationTwoStep.Second}`, [
                animate('300ms ease-in-out')
            ])
        ]),
    ]
})
export class AuthComponent {
    returnUrl: string = '/';

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

    allPageState: AnimationTwoStep = AnimationTwoStep.Second;

    loadedBlockRef!: TemplateRef<any>;
    formState: AnimationTwoStep = AnimationTwoStep.First;

    loadingState: AnimationTwoStep = AnimationTwoStep.First;
    connectionErrorState: AnimationTwoStep = AnimationTwoStep.First;
    requestAlertState: AnimationTwoStep = AnimationTwoStep.First;
    preloaderState: AnimationTwoStep = AnimationTwoStep.First;

    protected readonly AlertType = AlertType;
    protected readonly ElementSize = ElementSize;
    protected readonly ElementType = ElementType;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private appDataService: AppDataService,
        private preloadService: PreloadService,
        private themeService: ThemeService,
        private authService: AuthService,
        private backupService: BackupService,
        public validationService: ValidationService
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
            { validators: passwordMatchValidator('Password', 'RepeatPassword') }
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
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.themeService.changeTheme(0);
        this.preloadService.preloadImages();

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
                this.connectionErrorState = AnimationTwoStep.Second;
            },
            error: () => {
                this.connectionErrorState = AnimationTwoStep.Second;
            }
        })
    }

    redirectToPage(url: string) {
        this.allPageState = AnimationTwoStep.First;
        setTimeout(() => {
            this.router.navigate([url]);
        }, 500);
    }

    loadBlock(targetBlock: TemplateRef<any>) {
        this.formState = AnimationTwoStep.First;
        this.requestAlertState = AnimationTwoStep.First;
        this.requestAlertMessage = ' ';
        this.loginForm.reset();
        this.registrationForm.reset();
        this.importForm.reset();
        setTimeout(() => {
            this.loadedBlockRef = targetBlock;
            this.formState = AnimationTwoStep.Second;
        }, 400);
    }

    startLoading() {
        this.isLoading = true;
        this.requestAlertMessage = ' ';
        this.requestAlertState = AnimationTwoStep.First;
        this.preloaderState = AnimationTwoStep.Second;
        this.loginForm.disable();
        this.registrationForm.disable();
        this.importForm.disable();
    }

    finishLoading() {
        this.isLoading = false;
        this.preloaderState = AnimationTwoStep.First;
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
                    this.redirectToPage('/');
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
                this.connectionErrorState = AnimationTwoStep.Second;
            }
        });
    }

    getUserStatus() {
        this.authService.getUserStatus().subscribe({
            next: (response) => {
                this.redirectToPage(this.returnUrl);
            },
            error: (err) => {
                this.onConnectionEstablished();
            }
        })
    }

    onSuccessAlert(message: string = 'Success'): void {
        this.requestAlertType = AlertType.Success;
        this.requestAlertMessage = message;
        this.requestAlertState = AnimationTwoStep.Second;
    }

    onErrorAlert(message: string = 'Server error'): void {
        this.requestAlertType = AlertType.Danger;
        this.requestAlertMessage = message;
        this.requestAlertState = AnimationTwoStep.Second;
    }

    onConnectionEstablished() {
        this.serverConnected = true;
        this.loadedBlockRef = this.loginFormBlock;
        this.loadingState = AnimationTwoStep.Second;
        setTimeout(() => {
            this.formState = AnimationTwoStep.Second;
        }, 1100)
    }
}
