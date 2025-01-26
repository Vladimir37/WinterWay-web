import { Injectable } from '@angular/core';
import { UserStatusModel } from '../models/status.models';
import { LoginDTO, RegistrationDTO } from '../models/auth.models';
import { catchError, tap, throwError } from 'rxjs';
import { AuthRequestService } from './requests/auth.request.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _userStatus: UserStatusModel | null = null;

    constructor(
        private authRequest: AuthRequestService
    ) {}

    get userStatus(): UserStatusModel | null {
        return this._userStatus;
    }

    login(loginData: LoginDTO) {
        return this.authRequest.login(loginData).pipe(
            tap(data => {
                this._userStatus = data;
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    registration(registrationData: RegistrationDTO) {
        return this.authRequest.registration(registrationData).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    logout() {
        return this.authRequest.logout().pipe(
            tap(() => {
                this._userStatus = null;
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    getUserStatus() {
        return this.authRequest.getUserStatus().pipe(
            tap(data => {
                this._userStatus = data;
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
