import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { ElementSize, ElementType } from '../../../../shared/enums/element-types.enums';
import { WWButtonComponent } from '../../../../shared/components/button/button.component';
import { WWPreloaderComponent } from '../../../../shared/components/preloader/preloader.component';
import { BoardRequestService } from '../../../../core/services/requests/board.request.service';
import { SprintModel } from '../../../../core/models/boards.models';
import { SprintCardComponent } from '../../../../shared/components/sprint-card/sprint-card.component';
import { CalendarRequestService } from '../../../../core/services/requests/calendar.request.service';
import { CalendarModel } from '../../../../core/models/calendars.models';
import { CalendarCardComponent } from '../../../../shared/components/calendar-card/calendar-card.component';
import { TimerRequestService } from '../../../../core/services/requests/timer.request.service';
import { TimerModel } from '../../../../core/models/timers.models';
import { TimerLineComponent } from '../../../../shared/components/timer-line/timer-line.component';

@Component({
    standalone: true,
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    imports: [
        DatePipe,
        RouterLink,
        WWButtonComponent,
        WWPreloaderComponent,
        SprintCardComponent,
        CalendarCardComponent,
        TimerLineComponent,
    ],
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    currentDate: Date = new Date();
    allSprints: SprintModel[] = [];
    allCalendars: CalendarModel[] = [];
    allTimers: TimerModel[] = [];

    loadingStatus = {
        sprints: true,
        calendars: true,
        timers: true
    };
    errorStatus = {
        sprints: false,
        calendars: false,
        timers: false
    };

    constructor(
        private authService: AuthService,
        private boardRequest: BoardRequestService,
        private calendarRequest: CalendarRequestService,
        private timerRequest: TimerRequestService,
        private toastrService: ToastrService
    ) {}

    get username(): string {
        let formattedUsername = this.authService.userStatus!.username;
        if (formattedUsername.length > 18) {
            formattedUsername = formattedUsername.slice(0, 18) + '...';
        }
        return formattedUsername;
    }

    get greetings(): string {
        const hours = this.currentDate.getHours();

        if (hours >= 5 && hours < 12) {
            return 'Good morning';
        } else if (hours >= 12 && hours < 18) {
            return 'Good afternoon';
        } else if (hours >= 18 && hours < 22) {
            return 'Good evening';
        } else {
            return 'Good night';
        }
    }

    protected readonly ElementSize = ElementSize;
    protected readonly ElementType = ElementType;

    ngAfterViewInit() {
        this.loadSprints();
        this.loadCalendars();
        this.loadTimers();
    }

    loadSprints() {
        this.boardRequest.getAllBoards()
            .pipe(
                finalize(() => {
                    this.loadingStatus = {
                        ...this.loadingStatus,
                        sprints: false
                    };
                })
            )
            .subscribe({
                next: (response) => {
                    this.allSprints = response
                        .filter(board => board.actualSprint)
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map(board => {
                            board.actualSprint!.board = board;
                            return board.actualSprint!;
                        });
                },
                error: (err) => {
                    this.errorStatus = {
                        ...this.errorStatus,
                        sprints: true
                    };
                    this.toastrService.error('Error retrieving boards');
                }
            });
    }

    loadCalendars() {
        this.calendarRequest.getAllCalendars()
            .pipe(
                finalize(() => {
                    this.loadingStatus = {
                        ...this.loadingStatus,
                        calendars: false
                    };
                })
            )
            .subscribe({
                next: (response) => {
                    this.allCalendars = response.sort((a, b) => a.sortOrder - b.sortOrder);
                },
                error: (err) => {
                    this.errorStatus = {
                        ...this.errorStatus,
                        calendars: true
                    };
                    this.toastrService.error('Error retrieving calendars');
                }
            });
    }

    loadTimers() {
        this.timerRequest.getAllTimers()
            .pipe(
                finalize(() => {
                    this.loadingStatus = {
                        ...this.loadingStatus,
                        timers: false
                    };
                })
            )
            .subscribe({
                next: (response) => {
                    this.allTimers = response
                        .filter(e => !e.archived)
                        .filter(e => e.timerSessions.filter(ts => ts.active).length > 0)
                        .sort((a, b) => a.sortOrder - b.sortOrder);
                },
                error: (err) => {
                    this.errorStatus = {
                        ...this.errorStatus,
                        timers: true
                    };
                    this.toastrService.error('Error retrieving timers');
                }
            });
    }
}
