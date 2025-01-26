import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { finalize, Subscription } from 'rxjs';
import { AnimationTwoStep } from '../../../core/enums/animation-steps.enum';
import { ElementSize, ElementType } from '../../../shared/enums/element-types.enums';
import { WWRadioComponent } from '../../../shared/components/radio/radio.component';
import { RadioElement } from '../../../shared/components/radio/radio.model';
import { NotificationRequestService } from './notification.request.service';
import { WWPreloaderComponent } from '../../../shared/components/preloader/preloader.component';
import { NotificationRequestDTO, Notification } from './notifications.models';

@Component({
    standalone: true,
    selector: 'notifications',
    imports: [
        NgIf,
        NgOptimizedImage,
        NgForOf,
        FormsModule,
        WWRadioComponent,
        WWPreloaderComponent,
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
    stepSize: number = 10;

    notificationBlockOpened: boolean = false;

    isLoading: boolean = false;
    isMoreAvailable: boolean = true;
    requestSubscription: Subscription | null = null;

    unreadNotificationsCount: number = 0;
    activeNotifications: Notification[] = [];
    activeNotificationsCount: number = 0;

    _activeListTab: number = 0;
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

    protected readonly ElementType = ElementType;
    protected readonly ElementSize = ElementSize;

    constructor(
        private notificationsRequest: NotificationRequestService
    ) {}

    get notificationBlockState(): AnimationTwoStep {
        if (!this.notificationBlockOpened) {
            return AnimationTwoStep.First;
        }
        return AnimationTwoStep.Second;
    }

    get unreadNotificationsCountFormatted(): string | null {
        if (this.unreadNotificationsCount >= 100) {
            return '99+';
        } else if (this.unreadNotificationsCount > 0) {
            return String(this.unreadNotificationsCount);
        }
        return null;
    }

    get activeListTab() {
        return this._activeListTab;
    }

    set activeListTab(value: number) {
        this._activeListTab = value;
        this.activeNotifications = [];
        this.activeNotificationsCount = 0;
        this.isLoading = false;
        this.isMoreAvailable = true;
        this.requestSubscription?.unsubscribe();
        this.loadNotifications();
    }

    ngAfterViewInit() {
        this.loadNotifications();
    }

    ngOnDestroy() {
        this.requestSubscription?.unsubscribe();
    }

    toggleNotificationBlock() {
        this.notificationBlockOpened = !this.notificationBlockOpened;
    }

    loadNotifications() {
        this.isLoading = true;

        let isRead: boolean | null = null;
        if (this.activeListTab === 0) {
            isRead = false;
        } else if (this.activeListTab === 1) {
            isRead = true;
        }
        const query = new NotificationRequestDTO(this.stepSize, this.activeNotificationsCount, isRead);
        this.requestSubscription = this.notificationsRequest.getNotifications(query).pipe(
            finalize(() => {
                this.isLoading = false;
            })
        ).subscribe({
            next: (response) => {
                this.unreadNotificationsCount = response.unreadCount;
                this.activeNotifications = response.notifications;
                if (response.notifications.length < this.stepSize) {
                    this.isMoreAvailable = false;
                }
            },
            error: (err) => {
                console.log(err);
            }
        })
    }
}
