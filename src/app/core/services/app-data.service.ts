import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AppStatusModel, BackgroundStatusModel, UserStatusModel } from '../models/status.models';
import { HttpEvent } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AppDataService {
    private _appStatus: AppStatusModel | null = null;
    private _backgroundStatus: BackgroundStatusModel | null = null;

    constructor(private request: RequestService) {}

    get appStatus(): AppStatusModel | null {
        return this._appStatus;
    }

    getAppStatus() {
        return this.request.get<AppStatusModel>('auth/app-status').pipe(
            tap(data => {
                this._appStatus = data;
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    getBackgroundStatus() {
        return this.request.get<BackgroundStatusModel>('auth/background-status').pipe(
            tap(data => {
                this._backgroundStatus = data;
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
