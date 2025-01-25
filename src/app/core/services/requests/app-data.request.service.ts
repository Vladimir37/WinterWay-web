import { Injectable } from '@angular/core';
import { RequestService } from './_request.service';
import { AppStatusModel, BackgroundStatusModel } from '../../models/status.models';
import { catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppDataRequestService {
    constructor(
        private request: RequestService,
    ) {}

    getAppStatus() {
        return this.request.get<AppStatusModel>('auth/app-status').pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    getBackgroundStatus() {
        return this.request.get<BackgroundStatusModel>('auth/background-status').pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
