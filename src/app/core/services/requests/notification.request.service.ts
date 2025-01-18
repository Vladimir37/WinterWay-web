import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { RequestService } from './_request.service';
import { Notification, NotificationChangeRequestDTO, NotificationRequestDTO } from '../../models/notifications.models';

@Injectable({
    providedIn: 'root'
})
export class NotificationRequestService {
    constructor(private request: RequestService) {}

    getAll(notificationRequest: NotificationRequestDTO) {
        return this.request.get<Notification[]>('notification/get-all', notificationRequest).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    calculate() {
        return this.request.get<Notification[]>('notification/calculate').pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    read(notificationChangeRequest: NotificationChangeRequestDTO) {
        return this.request.post<Notification[]>('notification/read', notificationChangeRequest).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    archive(notificationChangeRequest: NotificationChangeRequestDTO) {
        return this.request.post<Notification[]>('notification/archive', notificationChangeRequest).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
