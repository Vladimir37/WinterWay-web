import { Injectable } from '@angular/core';
import { differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, subYears, subMonths, subDays, subHours, subMinutes } from 'date-fns';

@Injectable({
    providedIn: 'root'
})
export class PeriodService {
    getPeriodInFullMeasure(start: Date, finish: Date) {
        let isExpired = false;
        let laterDate, earlierDate;

        if (finish < start) {
            isExpired = true;
            laterDate = start
            earlierDate = finish;
        } else {
            laterDate = finish;
            earlierDate = start;
        }

        let message: string;

        const years = differenceInYears(laterDate, earlierDate);
        const remainingAfterYears = subYears(laterDate, years);

        const months = differenceInMonths(remainingAfterYears, earlierDate);
        const remainingAfterMonths = subMonths(remainingAfterYears, months);

        const days = differenceInDays(remainingAfterMonths, earlierDate);
        const remainingAfterDays = subDays(remainingAfterMonths, days);

        const hours = differenceInHours(remainingAfterDays, earlierDate);
        const remainingAfterHours = subHours(remainingAfterDays, hours);

        const minutes = differenceInMinutes(remainingAfterHours, earlierDate);
        const remainingAfterMinutes = subMinutes(remainingAfterHours, minutes);

        const seconds = differenceInSeconds(remainingAfterMinutes, earlierDate);

        const result = {
            years: this.getDateCountMessage(years, 'y.', true),
            months: this.getDateCountMessage(months, 'm.', true),
            days: this.getDateCountMessage(days, 'd.', true),
            hours,
            minutes,
            seconds
        };

        return {
            isExpired,
            message: result
        };
    }
    getPeriodInMaxMeasure(start: Date, finish: Date) {
        let isExpired = false;
        let laterDate, earlierDate;

        if (finish < start) {
            isExpired = true;
            laterDate = start
            earlierDate = finish;
        } else {
            laterDate = finish;
            earlierDate = start;
        }

        let message: string;

        const monthsBetween = differenceInMonths(laterDate, earlierDate);
        const daysBetween = differenceInDays(laterDate, earlierDate);
        const hoursBetween = differenceInHours(laterDate, earlierDate);
        const minutesBetween = differenceInMinutes(laterDate, earlierDate);

        if (monthsBetween > 0) {
            message = this.getDateCountMessage(monthsBetween, 'month');
        } else if (daysBetween > 0) {
            message = this.getDateCountMessage(daysBetween, 'day');
        } else if (hoursBetween > 0) {
            message = this.getDateCountMessage(hoursBetween, 'hour');
        } else if (minutesBetween > 0) {
            message = this.getDateCountMessage(minutesBetween, 'minute');
        } else {
            message = 'Expires';
        }

        return {
            isExpired,
            message
        };
    }

    private getDateCountMessage(count: number, title: string, alwaysSingle: boolean = false): string {
        if (count <= 0) {
            return '';
        } else if (count > 1 && !alwaysSingle) {
            return `${count} ${title}s`;
        }
        return `${count} ${title}`;
    }
}
