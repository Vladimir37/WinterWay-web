import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationRequestService } from './requests/notification.request.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    unreadNotifications: Notification[] = [];

    constructor(private notificationRequestService: NotificationRequestService) { }

    //
}
