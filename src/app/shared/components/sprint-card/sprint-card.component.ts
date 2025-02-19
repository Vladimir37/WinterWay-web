import { Component, Input } from '@angular/core';
import { SprintModel } from '../../../core/models/boards.models';

@Component({
    standalone: true,
    selector: 'sprint-card',
    templateUrl: './sprint-card.component.html',
    imports: [],
    styleUrl: './sprint-card.component.scss'
})
export class SprintCardComponent {
    @Input() sprint!: SprintModel;

    get boardName(): string {
        if (!this.sprint.board) {
            return '';
        }
        if (this.sprint.board?.name.length > 18) {
            return `${this.sprint.board?.name.substring(0, 16)}…`;
        }
        return this.sprint.name;
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
}
