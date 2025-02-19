import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgOptimizedImage } from '@angular/common';
import { finalize, Subscription } from 'rxjs';
import { AnimationTwoStep } from '../../../core/enums/animation-steps.enum';
import { ElementSize, ElementType } from '../../../shared/enums/element-types.enums';
import { RadioElement } from '../../../shared/components/radio/radio.model';
import { NotificationRequestService } from './services/notification.request.service';
import {
    NotificationRequestDTO,
    Notification,
    NotificationRequestWithoutReadDTO,
    NotificationChangeRequestDTO
} from './notifications.models';
import { WWRadioComponent } from '../../../shared/components/radio/radio.component';
import { WWPreloaderComponent } from '../../../shared/components/preloader/preloader.component';
import { WWButtonComponent } from '../../../shared/components/button/button.component';
import { ToastService } from '../../../core/services/toast.service';
import { AppHoverDelayDirective } from '../../../shared/directives/hover-delay.directive';
import { NotificationsUpdateService } from './services/notifications-update.service';
import { AppClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

@Component({
    standalone: true,
    selector: 'notifications',
    imports: [
        NgOptimizedImage,
        NgClass,
        FormsModule,
        DatePipe,
        AppHoverDelayDirective,
        AppClickOutsideDirective,
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
    @Input() id: string = '';

    stepSize: number = 2;

    notificationBlockOpened: boolean = false;

    isLoading: boolean = false;
    isMoreAvailable: boolean = true;
    requestSubscription: Subscription | null = null;

    unreadNotificationsCount: number = 0;
    activeNotifications: Notification[] = [];

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
        private notificationsUpdateService: NotificationsUpdateService,
        private toastService: ToastService,
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
        this.isLoading = false;
        this.isMoreAvailable = true;
        this.requestSubscription?.unsubscribe();
        this.loadNotifications();
    }

    get visibleNotificationsLength(): number {
        let notifications: Notification[] = this.activeNotifications.filter(elem => !elem.archived);
        return notifications.length;
    }

    get correctNotificationsLength(): number {
        let notifications: Notification[] = this.activeNotifications.filter(elem => !elem.archived);
        if (this.activeListTab !== 2) {
            notifications = notifications.filter(elem => elem.isRead === (this.activeListTab === 1));
        }
        return notifications.length;
    }

    ngAfterViewInit() {
        this.loadNotifications();
        this.notificationsUpdateService.response$.subscribe(response => {
            if (response === null) {
                return;
            }
            this.unreadNotificationsCount = response.unreadCount;
            if (this.activeListTab !== 1) {
                this.activeNotifications = [
                    ...response.notifications,
                    ...this.activeNotifications
                ];
            }
        });
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

    closeNotificationBlock() {
        this.notificationBlockOpened = false;
        setTimeout(() => {
            this.activeListTab = 0;
        }, 220);
    }

    loadNotifications() {
        this.isLoading = true;
        this.cdr.detectChanges();

        let query: NotificationRequestDTO | NotificationRequestWithoutReadDTO;
        if (this.activeListTab === 2) {
            query = new NotificationRequestWithoutReadDTO(this.stepSize, this.correctNotificationsLength);
        } else {
            query = new NotificationRequestDTO(this.stepSize, this.correctNotificationsLength, this.activeListTab === 1);
        }

        this.requestSubscription = this.notificationsRequest.getNotifications(query).pipe(
            finalize(() => {
                this.isLoading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (response) => {
                this.unreadNotificationsCount = response.unreadCount;
                const uniqueNotifications = response.notifications.filter(elem => {
                    return !this.activeNotifications.find(notification => notification.id === elem.id);
                });
                this.activeNotifications = [
                    ...this.activeNotifications,
                    ...uniqueNotifications
                ];
                if (response.notifications.length < this.stepSize) {
                    this.isMoreAvailable = false;
                }
            },
            error: () => {
                this.toastService.createErrorToast('Error retrieving notifications');
            }
        })
    }
    removeNotification(isRead: boolean, notificationId: number) {
        if (!isRead) {
            return;
        }
        this.changeNotificationsArchiveStatus(notificationId, true);
        const query: NotificationChangeRequestDTO = new NotificationChangeRequestDTO([notificationId]);
        this.notificationsRequest.archive(query).subscribe({
            next: (response) => {
                this.unreadNotificationsCount = response.unreadCount;
                if (this.visibleNotificationsLength === 0) {
                    this.loadNotifications();
                }
            },
            error: () => {
                this.toastService.createErrorToast('Error changing notifications status');
                this.changeNotificationsArchiveStatus(notificationId, false);
            }
        })
    }
    readOneNotification(isRead: boolean, notificationId: number) {
        if (isRead) {
            return;
        }
        this.changeNotificationsReadStatus([notificationId], true);
        const query: NotificationChangeRequestDTO = new NotificationChangeRequestDTO([notificationId]);
        this.notificationsRequest.read(query).subscribe({
            next: (response) => {
                this.unreadNotificationsCount = response.unreadCount;
            },
            error: () => {
                this.toastService.createErrorToast('Error changing notifications status');
                this.changeNotificationsReadStatus([notificationId], false);
            }
        })
    }
    readAllNotifications() {
        const unreadNotificationIds = this.activeNotifications.filter(elem => !elem.isRead).map(elem => elem.id);
        if (unreadNotificationIds.length === 0) {
            return;
        }
        this.changeNotificationsReadStatus(unreadNotificationIds, true);
        const query: NotificationChangeRequestDTO = new NotificationChangeRequestDTO(unreadNotificationIds);
        this.notificationsRequest.read(query).subscribe({
            next: (response) => {
                this.unreadNotificationsCount = response.unreadCount;
            },
            error: () => {
                this.toastService.createErrorToast('Error changing notifications status');
                this.changeNotificationsReadStatus(unreadNotificationIds, false);
            }
        })
    }

    changeNotificationsReadStatus(notifications: number[], status: boolean) {
        this.activeNotifications.forEach(elem => {
            if (notifications.includes(elem.id)) {
                elem.isRead = status;
            }
        })
    }
    changeNotificationsArchiveStatus(notification: number, status: boolean) {
        const targetNotification = this.activeNotifications.find(elem => elem.id === notification);
        if (targetNotification) {
            targetNotification.archived = status;
        }
    }
}
