import { Injectable } from '@angular/core';
import { RequestService } from './_request.service';
import { catchError, throwError } from 'rxjs';
import { ApiSuccessModel } from '../../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class BackupRequestService {
    constructor(private request: RequestService) {}

    import(importData: string) {
        const importObject = JSON.parse(importData);
        return this.request.post<ApiSuccessModel>('backup/import', importObject).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
