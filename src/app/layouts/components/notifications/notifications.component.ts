import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { AnimationTwoStep } from '../../../core/enums/animation-steps.enum';
import { ElementSize, ElementType } from '../../../shared/enums/element-types.enums';
import { WWRadioComponent } from '../../../shared/components/radio/radio.component';
import { RadioElement } from '../../../shared/components/radio/radio.model';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    standalone: true,
    selector: 'notifications',
    imports: [
        WWRadioComponent,
        FormsModule,
        NgTemplateOutlet,
    ],
    animations: [
        trigger('notificationBlockAnimation', [
            state(AnimationTwoStep.First, style({
                'pointer-events': 'none',
                'opacity': '0'
            })),
            state(AnimationTwoStep.Second, style({
                'pointer-events': 'auto',
                'opacity': '1'
            })),
            transition(`${AnimationTwoStep.First} <=> ${AnimationTwoStep.Second}`, [
                animate('200ms ease-in-out')
            ])
        ]),
    ],
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
    @Input() show: boolean = false;

    activeListTab: number = 0;
    listOptions: RadioElement[] = [
        {
            value: 0,
            title: 'Unread'
        },
        {
            value: 1,
            title: 'Read'
        },
        {
            value: 2,
            title: 'All'
        },
    ];

    @ViewChild('unreadMessages') unreadMessagesBlock!: TemplateRef<any>;
    @ViewChild('readMessages') readMessagesBlock!: TemplateRef<any>;
    @ViewChild('allMessages') allMessagesBlock!: TemplateRef<any>;

    protected readonly ElementType = ElementType;
    protected readonly ElementSize = ElementSize;

    get notificationBlockState(): AnimationTwoStep {
        if (!this.show) {
            return AnimationTwoStep.First;
        }
        return AnimationTwoStep.Second;
    }

    get activeBlock(): TemplateRef<any> {
        if (this.activeListTab === 0) {
            return this.unreadMessagesBlock;
        } else if (this.activeListTab === 1) {
            return this.readMessagesBlock;
        } else {
            return this.allMessagesBlock;
        }
    }
}
