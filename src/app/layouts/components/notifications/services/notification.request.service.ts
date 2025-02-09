import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { RequestService } from '../../../../core/services/requests/_request.service';
import {
    NotificationChangeRequestDTO,
    NotificationRequestDTO, NotificationRequestWithoutReadDTO,
    NotificationResponseDTO
} from '../notifications.models';

@Injectable({
    providedIn: 'root'
})
export class NotificationRequestService {
    constructor(private request: RequestService) {}

    getNotifications(notificationRequest: NotificationRequestDTO | NotificationRequestWithoutReadDTO) {
        return this.request.get<NotificationResponseDTO>('notification/get-all', notificationRequest).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    calculate() {
        return this.request.get<NotificationResponseDTO>('notification/calculate').pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    read(notificationChangeRequest: NotificationChangeRequestDTO) {
        return this.request.post<NotificationResponseDTO>('notification/read', notificationChangeRequest).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    archive(notificationChangeRequest: NotificationChangeRequestDTO) {
        return this.request.post<NotificationResponseDTO>('notification/archive', notificationChangeRequest).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
