import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { TimerModel } from '../../../core/models/timers.models';
import { TimerCounter } from './timer-line.models';
import { PeriodService } from '../../../core/services/period.service';

@Component({
    standalone: true,
    selector: 'timer-line',
    templateUrl: './timer-line.component.html',
    imports: [
        NgStyle
    ],
    styleUrl: './timer-line.component.scss'
})
export class TimerLineComponent {
    @Input() timer!: TimerModel;

    private timerCounterRefreshInterval: any;
    activeTimerCounter: TimerCounter = {
        isActive: false,
        times: {
            years: '',
            months: '',
            days: '',
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    };

    constructor(private periodService: PeriodService) {}

    ngOnInit() {
        this.getTimerDateCount();
        this.timerCounterRefreshInterval = setInterval(() => {
            this.getTimerDateCount();
        }, 1000);
    }

    ngOnDestroy() {
        if (this.timerCounterRefreshInterval) {
            clearInterval(this.timerCounterRefreshInterval);
        }
    }

    get timerColorStyles() {
        return {
            background: this.timer.color
        }
    }

    getTimerDateCount() {
        const activeTimerSession = this.timer.timerSessions.filter(e => e.active)[0];
        if (!activeTimerSession) {
            this.activeTimerCounter = {
                isActive: false,
                times: {
                    years: '',
                    months: '',
                    days: '',
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                }
            }
        }

        const currentDate = new Date();
        const timerSessionStart = new Date(activeTimerSession.creationDate);

        const results = this.periodService.getPeriodInFullMeasure(timerSessionStart, currentDate);

        this.activeTimerCounter = {
            isActive: true,
            times: results.message
        }
    }

    protected readonly String = String;
}
