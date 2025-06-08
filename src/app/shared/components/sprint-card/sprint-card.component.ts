import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { SprintModel } from '../../../core/models/boards.models';
import { PeriodService } from '../../../core/services/period.service';

@Component({
    standalone: true,
    selector: 'sprint-card',
    templateUrl: './sprint-card.component.html',
    imports: [
        NgStyle,
        NgClass,
    ],
    styleUrl: './sprint-card.component.scss'
})
export class SprintCardComponent {
    @Input() sprint!: SprintModel;

    constructor(private periodService: PeriodService) {}

    get boardName(): string {
        if (!this.sprint.board) {
            return '';
        }
        if (this.sprint.board?.name.length > 17) {
            return `${this.sprint.board?.name.substring(0, 15)}…`;
        }
        return this.sprint.board?.name;
    }

    get sprintName(): string {
        if (this.sprint.name.length > 18) {
            return `${this.sprint.name.substring(0, 16)}…`;
        }
        return this.sprint.name;
    }

    get tasksStatus(): string {
        const tasksTotal = this.sprint.tasks?.length;
        const tasksCompleted = this.sprint.tasks?.filter(elem => elem.isDone).length;
        return `${tasksCompleted}/${tasksTotal}`;
    }

    get borderStyles() {
        if (!this.sprint.board?.color) {
            return {
                borderColor: `var(--primaryColor)`
            };
        }
        return {
            border: `7px solid ${this.sprint.board?.color}`,
            padding: `3px 9px`
        }
    }

    get isReadyForRoll(): boolean {
        if (!this.sprint.expirationDate) {
            return false;
        }
        const expirationDate = new Date(this.sprint.expirationDate);
        const currentDate = new Date();
        return expirationDate < currentDate;
    }

    get dateCounter() {
        if (!this.sprint.expirationDate) {
            return {
                isExists: false,
                isExpired: null,
                message: null
            };
        }

        const expirationDate = new Date(this.sprint.expirationDate);
        const currentDate = new Date();

        const datePeriod = this.periodService.getPeriodInMaxMeasure(currentDate, expirationDate);

        return {
            isExists: true,
            isExpired: datePeriod.isExpired,
            message: datePeriod.message
        };
    }
}
