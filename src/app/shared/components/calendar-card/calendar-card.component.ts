import { Component, Input } from '@angular/core';
import { CalendarModel } from '../../../core/models/calendars.models';

@Component({
    standalone: true,
    selector: 'calendar-card',
    templateUrl: './calendar-card.component.html',
    imports: [],
    styleUrl: './calendar-card.component.scss'
})
export class CalendarCardComponent {
    @Input() calendar!: CalendarModel;

    get calendarName(): string {
        if (!this.calendar.name) {
            return '';
        }
        if (this.calendar.name.length > 18) {
            return `${this.calendar.name.substring(0, 16)}…`;
        }
        return this.calendar.name;
    }
}
