import { Injectable } from '@angular/core';
import { RequestService } from './_request.service';
import { ChangePasswordDTO, EditUserDTO, LoginDTO, RegistrationDTO } from '../../models/auth.models';
import { UserStatusModel } from '../../models/status.models';
import { catchError, throwError } from 'rxjs';
import { ApiSuccessModel } from '../../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class AuthRequestService {
    constructor(
        private request: RequestService,
    ) {}

    login(loginData: LoginDTO) {
        return this.request.post<UserStatusModel>('auth/login', loginData).pipe(
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
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
