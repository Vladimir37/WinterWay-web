import { Injectable } from '@angular/core';
import { RequestService } from './requests/_request.service';
import { catchError, tap, throwError } from 'rxjs';
import { ApiSuccessModel } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    constructor(private request: RequestService) {}

    import(importData: string) {
        const importObject = JSON.parse(importData);
        return this.request.post<ApiSuccessModel>('backup/import', importObject).pipe(
            tap(data => {
                return data;
            }),
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
