import { Injectable } from '@angular/core';
import { NotificationRequestService } from './notification.request.service';
import { BehaviorSubject, interval, switchMap } from 'rxjs';
import { NotificationResponseDTO } from '../notifications.models';

@Injectable({
    providedIn: 'root'
})
export class NotificationsUpdateService {
    private responseSubject = new BehaviorSubject<NotificationResponseDTO | null>(null);
    public response$ = this.responseSubject.asObservable();

    constructor(private notificationRequest: NotificationRequestService) {
        this.startPeriodicUpdate();
    }

    private startPeriodicUpdate() {
        interval(1000 * 60 * 15)
            .pipe(
                switchMap(() => this.notificationRequest.calculate())
            )
            .subscribe({
                next: (response: NotificationResponseDTO) => {
                    this.responseSubject.next(response);
                }
            })
    }
}
