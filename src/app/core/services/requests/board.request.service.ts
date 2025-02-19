import { Injectable } from '@angular/core';
import { RequestService } from './_request.service';
import { UserStatusModel } from '../../models/status.models';
import { catchError, throwError } from 'rxjs';
import { BoardModel } from '../../models/boards.models';

@Injectable({
    providedIn: 'root'
})
export class BoardRequestService {
    constructor(private request: RequestService) {}

    getAllBoards() {
        return this.request.get<BoardModel[]>('board/all-boards').pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    getAllSprints() {
        return this.request.get<UserStatusModel>('board/all-sprints').pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}
