import { Injectable } from '@angular/core';
import { UserStatusModel } from '../models/status.models';
import { RequestService } from './requests/_request.service';
import { ChangePasswordDTO, EditUserDTO, LoginDTO, RegistrationDTO } from '../models/auth.models';
import { catchError, tap, throwError } from 'rxjs';
import { ApiSuccessModel } from '../models/api.models';
import { ThemeService } from './theme.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _userStatus: UserStatusModel | null = null;

    constructor(
        private request: RequestService,
        private themeService: ThemeService
    ) {}

    get userStatus(): UserStatusModel | null {
        return this._userStatus;
    }

    login(loginData: LoginDTO) {
        return this.request.post<UserStatusModel>('auth/login', loginData).pipe(
            tap(data => {
                this._userStatus = data;
                this.themeService.changeTheme(data.themeType);
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    registration(registrationData: RegistrationDTO) {
        return this.request.post<ApiSuccessModel>('auth/signup', registrationData).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    logout() {
        return this.request.post<ApiSuccessModel>('auth/logout', {}).pipe(
            tap(() => {
                this._userStatus = null;
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    editUser(editUserData: EditUserDTO) {
        return this.request.post<ApiSuccessModel>('auth/edit-user', editUserData).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    changePassword(changePasswordDTO: ChangePasswordDTO) {
        return this.request.post<ApiSuccessModel>('auth/change-password', changePasswordDTO).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    getUserStatus() {
        return this.request.get<UserStatusModel>('auth/user-status').pipe(
            tap(data => {
                this._userStatus = data;
                this.themeService.changeTheme(data.themeType);
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
