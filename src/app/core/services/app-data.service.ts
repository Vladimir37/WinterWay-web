import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AppStatusModel, BackgroundStatusModel } from '../models/status.models';
import { AppDataRequestService } from './requests/app-data.request.service';

@Injectable({
    providedIn: 'root'
})
export class AppDataService {
    private _appStatus: AppStatusModel | null = null;
    private _backgroundStatus: BackgroundStatusModel | null = null;

    constructor(private appDataRequest: AppDataRequestService) {}

    get appStatus(): AppStatusModel | null {
        return this._appStatus;
    }

    getAppStatus() {
        return this.appDataRequest.getAppStatus().pipe(
            tap(data => {
                this._appStatus = data;
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    getBackgroundStatus() {
        return this.appDataRequest.getBackgroundStatus().pipe(
            tap(data => {
                this._backgroundStatus = data;
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
