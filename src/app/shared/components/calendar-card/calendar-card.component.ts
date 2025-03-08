import { Component, Input } from '@angular/core';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { CalendarModel, CalendarType } from '../../../core/models/calendars.models';

@Component({
    standalone: true,
    selector: 'calendar-card',
    templateUrl: './calendar-card.component.html',
    imports: [
        NgStyle,
        NgOptimizedImage
    ],
    styleUrl: './calendar-card.component.scss'
})
export class CalendarCardComponent {
    @Input() calendar!: CalendarModel;

    get calendarName(): string {
        if (!this.calendar.name) {
            return '';
        }
        if (this.calendar.name.length > 27) {
            return `${this.calendar.name.substring(0, 24)}…`;
        }
        return this.calendar.name;
    }

    get borderStyles() {
        if (!this.calendar?.color) {
            return {
                borderColor: `var(--primaryColor)`
            };
        }
        return {
            border: `7px solid ${this.calendar?.color}`,
            padding: `3px 9px`
        }
    }

    get canCreateRecordToday(): boolean {
        return !this.calendar.calendarRecords.length;
    }

    get calendarType(): string {
        switch (this.calendar.type) {
            case CalendarType.Boolean:
                return 'Binary calendar';
            case CalendarType.Numeric:
                return 'Calendar with numerical values';
            case CalendarType.Time:
                return 'Time log calendar';
            case CalendarType.Fixed:
                return 'Calendar with fixed values';
            default:
                return 'Other calendar';
        }
    }
}
