import { Injectable } from '@angular/core';
import { UserStatusModel } from '../models/status.models';
import { RequestService } from './request.service';
import { LoginDTO, RegistrationDTO } from '../models/auth.models';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _userStatus: UserStatusModel | null = null;

    constructor(private request: RequestService) {}

    get userStatus(): UserStatusModel | null {
        return this._userStatus;
    }

    login(loginData: LoginDTO) {
        return this.request.post<UserStatusModel>('auth/login', loginData).pipe(
            tap(data => {
                this._userStatus = data;
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    registration(registrationData: RegistrationDTO) {
        return this.request.post<UserStatusModel>('auth/signup', registrationData).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
