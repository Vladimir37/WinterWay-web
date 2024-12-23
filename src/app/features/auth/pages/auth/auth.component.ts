import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { WWAlertComponent } from '../../../../shared/components/alert/alert.component';
import { AlertType } from '../../../../shared/components/alert/alert.enums';
import { AnimationFormStep, AnimationTwoStep } from './animation-steps.enum';
import { ButtonSize, ButtonType } from '../../../../shared/components/button/button.enums';
import { WWButtonComponent } from '../../../../shared/components/button/button.component';
import { WWInputComponent } from '../../../../shared/components/input/input.component';
import { WWTextareaComponent } from '../../../../shared/components/textarea/textarea.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        NgOptimizedImage,
        NgTemplateOutlet,
        WWButtonComponent,
        WWInputComponent,
        WWAlertComponent,
        WWTextareaComponent,
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
            state(AnimationTwoStep.Start, style({
                'pointer-events': 'none',
                opacity: '0'
            })),
            state(AnimationTwoStep.Finish, style({
                'pointer-events': 'auto',
                opacity: '1'
            })),
            transition(`${AnimationTwoStep.Start} <=> ${AnimationTwoStep.Finish}`, [
                animate('500ms ease-in-out')
            ])
        ]),
        trigger('authFormAnimation', [
            state(AnimationFormStep.Hidden, style({
                'pointer-events': 'none',
                'opacity': '0'
            })),
            state(AnimationFormStep.Visible, style({
                'pointer-events': 'auto',
                'opacity': '1'
            })),
            transition(`${AnimationFormStep.Hidden} <=> ${AnimationFormStep.Visible}`, [
                animate('300ms ease-in-out')
            ])
        ]),
    ]
})
export class AuthComponent {
    serverError: boolean = false;
    serverConnected: boolean = false;

    login: string = '';
    password: string = '';

    @ViewChild('loginForm') loginForm!: TemplateRef<any>;
    @ViewChild('registerForm') registerForm!: TemplateRef<any>;
    @ViewChild('importForm') importForm!: TemplateRef<any>;

    loadedBlockRef!: TemplateRef<any>;
    formState: AnimationFormStep = AnimationFormStep.Hidden;

    loadingState: AnimationTwoStep = AnimationTwoStep.Start;
    errorState: AnimationTwoStep = AnimationTwoStep.Start;

    protected readonly AlertType = AlertType;
    protected readonly ButtonSize = ButtonSize;
    protected readonly ButtonType = ButtonType;

    loadBlock(targetBlock: TemplateRef<any>) {
        this.formState = AnimationFormStep.Hidden;
        setTimeout(() => {
            this.loadedBlockRef = targetBlock;
            this.formState = AnimationFormStep.Visible;
        }, 400);
    }

    Login() {
        console.log('Login');
    }

    // TODO Remove when server
    ngAfterViewInit() {
        setTimeout(() => {
            this.loadedBlockRef = this.loginForm;
            this.loading();
        }, 1500)
    }

    loading() {
        this.loadingState = AnimationTwoStep.Finish;
        setTimeout(() => {
            this.formState = AnimationFormStep.Visible;
        }, 1100)
    }
}
