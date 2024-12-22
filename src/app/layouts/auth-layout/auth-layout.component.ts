import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { WWAlertComponent } from '../../shared/components/alert/alert.component';
import { AlertType } from '../../shared/components/alert/alert.enums';
import { AnimationStep } from './animation-steps.enum';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NgOptimizedImage,
        WWAlertComponent,
    ],
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.scss',
    animations: [
        trigger('authLogoAnimation', [
            state(AnimationStep.Start, style({
                transform: 'scale(2)',
                top: '200px'
            })),
            state(AnimationStep.Finish, style({
                transform: 'scale(1)',
                top: '0'
            })),
            transition(`${AnimationStep.Start} <=> ${AnimationStep.Finish}`, [
                animate('1000ms ease-in-out')
            ])
        ]),
        trigger('authFormAnimation', [
            state(AnimationStep.Start, style({
                'pointer-events': 'none',
                opacity: '0'
            })),
            state(AnimationStep.Finish, style({
                'pointer-events': 'auto',
                opacity: '1'
            })),
            transition(`${AnimationStep.Start} <=> ${AnimationStep.Finish}`, [
                animate('1000ms 1000ms ease-in-out')
            ])
        ]),
        trigger('authErrorAnimation', [
            state(AnimationStep.Start, style({
                'pointer-events': 'none',
                opacity: '0'
            })),
            state(AnimationStep.Finish, style({
                'pointer-events': 'auto',
                opacity: '1'
            })),
            transition(`${AnimationStep.Start} <=> ${AnimationStep.Finish}`, [
                animate('500ms ease-in-out')
            ])
        ]),
    ]
})
export class AuthLayoutComponent {
    serverError: boolean = true;
    serverConnected: boolean = false;

    loadingState: AnimationStep = AnimationStep.Finish;
    errorState: AnimationStep = AnimationStep.Start;

    protected readonly AlertType = AlertType;

    // ngOnInit() {
    //     setTimeout(() => {
    //         this.testLoading();
    //     }, 1500)
    // }

    // testLoading() {
    //     this.loadingState = AnimationStep.Finish;
    // }
}
