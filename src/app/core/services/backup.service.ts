import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { UserStatusModel } from '../models/status.models';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    constructor(private request: RequestService) {}

    import(importData: string) {
        const importObject = JSON.parse(importData);
        return this.request.post<UserStatusModel>('backup/import', importObject).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
