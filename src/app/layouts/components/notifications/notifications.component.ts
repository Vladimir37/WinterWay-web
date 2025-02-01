import { ChangeDetectorRef, Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { finalize, Subscription } from 'rxjs';
import { AnimationTwoStep } from '../../../core/enums/animation-steps.enum';
import { ElementSize, ElementType } from '../../../shared/enums/element-types.enums';
import { RadioElement } from '../../../shared/components/radio/radio.model';
import { NotificationRequestService } from './notification.request.service';
import { NotificationRequestDTO, Notification, NotificationRequestWithoutReadDTO } from './notifications.models';
import { WWRadioComponent } from '../../../shared/components/radio/radio.component';
import { WWPreloaderComponent } from '../../../shared/components/preloader/preloader.component';
import { WWButtonComponent } from '../../../shared/components/button/button.component';

@Component({
    standalone: true,
    selector: 'notifications',
    imports: [
        NgIf,
        NgOptimizedImage,
        NgForOf,
        NgClass,
        FormsModule,
        DatePipe,
        WWRadioComponent,
        WWPreloaderComponent,
        WWButtonComponent,
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
    stepSize: number = 2;

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
        private notificationsRequest: NotificationRequestService,
        private cdr: ChangeDetectorRef
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
        if (!this.notificationBlockOpened) {
            setTimeout(() => {
                this.activeListTab = 0;
            }, 220);
        }
    }

    loadNotifications() {
        this.isLoading = true;
        this.cdr.detectChanges();

        let query: NotificationRequestDTO | NotificationRequestWithoutReadDTO;
        if (this.activeListTab === 2) {
            query = new NotificationRequestWithoutReadDTO(this.stepSize, this.activeNotificationsCount);
        } else {
            query = new NotificationRequestDTO(this.stepSize, this.activeNotificationsCount, this.activeListTab === 1);
        }

        this.requestSubscription = this.notificationsRequest.getNotifications(query).pipe(
            finalize(() => {
                this.isLoading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (response) => {
                this.unreadNotificationsCount = response.unreadCount;
                this.activeNotifications = [
                    ...this.activeNotifications,
                    ...response.notifications
                ];
                this.activeNotificationsCount = this.activeNotifications.length;
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
