import { Injectable } from '@angular/core';
import { RequestService } from './_request.service';
import { BoardModel } from '../../models/boards.models';
import { catchError, throwError } from 'rxjs';
import { UserStatusModel } from '../../models/status.models';
import { CalendarModel } from '../../models/calendars.models';

@Injectable({
    providedIn: 'root'
})
export class CalendarRequestService {
    constructor(private request: RequestService) {}

    getAllCalendars() {
        return this.request.get<CalendarModel[]>('calendar/get-all').pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
