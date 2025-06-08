import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { RequestService } from './_request.service';
import { TimerModel } from '../../models/timers.models';

@Injectable({
    providedIn: 'root'
})
export class TimerRequestService {
    constructor(private request: RequestService) {}

    getAllTimers() {
        return this.request.get<TimerModel[]>('timer/get-all').pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
