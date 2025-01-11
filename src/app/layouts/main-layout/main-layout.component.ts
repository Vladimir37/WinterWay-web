import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AnimationTwoStep } from '../../core/enums/animation-steps.enum';

@Component({
    standalone: true,
    selector: 'main-layout',
    imports: [RouterOutlet],
    animations: [
        trigger('windowBackgroundAnimation', [
            state(AnimationTwoStep.First, style({
                'pointer-events': 'none',
                'height': '0',
                'opacity': '0'
            })),
            state(AnimationTwoStep.Second, style({
                'pointer-events': 'auto',
                'height': '100%',
                'opacity': '1'
            })),
            transition(`${AnimationTwoStep.First} <=> ${AnimationTwoStep.Second}`, [
                animate('400ms ease-in-out')
            ])
        ]),
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
    windowBackgroundState: AnimationTwoStep = AnimationTwoStep.Second;

    ngAfterViewInit() {
        setTimeout(() => {
            this.windowBackgroundState = AnimationTwoStep.First;
        }, 200)
    }
}
