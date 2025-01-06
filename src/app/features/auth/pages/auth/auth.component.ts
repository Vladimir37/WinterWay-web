import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
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

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        NgOptimizedImage,
        NgTemplateOutlet,
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
    serverError: boolean = false;
    isLoading: boolean = false;

    errorMessage: string = ' ';

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
    requestErrorState: AnimationVisibilityStep = AnimationVisibilityStep.Hidden;
    preloaderState: AnimationVisibilityStep = AnimationVisibilityStep.Hidden;

    protected readonly AlertType = AlertType;
    protected readonly ButtonSize = ButtonSize;
    protected readonly ButtonType = ButtonType;

    constructor(private formBuilder: FormBuilder) {
        this.loginForm = this.formBuilder.group({
            Username: [
                '',
                [Validators.required, Validators.minLength(4), Validators.maxLength(40)],
            ],
            Password: [
                '',
                [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
            ]
        });
        this.registrationForm = this.formBuilder.group({});
        this.importForm = this.formBuilder.group({});
    }


    loadBlock(targetBlock: TemplateRef<any>) {
        this.formState = AnimationVisibilityStep.Hidden;
        this.requestErrorState = AnimationVisibilityStep.Hidden;
        this.errorMessage = ' ';
        this.serverError = false;
        this.loginForm.reset();
        this.registrationForm.reset();
        this.importForm.reset();
        setTimeout(() => {
            this.loadedBlockRef = targetBlock;
            this.formState = AnimationVisibilityStep.Visible;
        }, 400);
    }

    checkFieldValidity(fieldName: string): InputValidState {
        const targetField = this.loginForm.controls[fieldName];
        if (targetField.touched && targetField.invalid) {
            return InputValidState.Invalid;
        }
        return InputValidState.None;
    }

    LoginClick() {
        const formIsInvalid = this.loginForm.invalid;

        this.loginForm.disable();
        this.isLoading = true;
        this.serverError = false;
        this.errorMessage = ' ';
        this.requestErrorState = AnimationVisibilityStep.Hidden;
        this.preloaderState = AnimationVisibilityStep.Visible;

        if (formIsInvalid) {
            this.onError('Incorrect login or password');
            this.loginForm.enable();
            return;
        }

        // this.loginForm.value
        // this.loginForm.enable();

        // setTimeout(() => {
        //     this.loginForm.enable();
        //     this.onError('Incorrect login or password');
        // }, 2000)
    }

    RegistrationClick() {
        //
    }

    ImportClick() {
        //
    }

    // TODO Remove when server
    ngAfterViewInit() {
        setTimeout(() => {
            this.onConnectionEstablished();
        }, 500)
        // OR
        // setTimeout(() => {
        //     this.connectionErrorState = AnimationVisibilityStep.Visible;
        // }, 500)
    }

    onError(message: string): void {
        this.isLoading = false;
        this.serverError = true;
        this.errorMessage = message;
        this.requestErrorState = AnimationVisibilityStep.Visible;
        this.preloaderState = AnimationVisibilityStep.Hidden;
    }

    onConnectionEstablished() {
        this.loadedBlockRef = this.loginFormBlock;
        this.loadingState = AnimationTwoStep.Finish;
        setTimeout(() => {
            this.formState = AnimationVisibilityStep.Visible;
        }, 1100)
    }

    protected readonly InputValidState = InputValidState;
}
