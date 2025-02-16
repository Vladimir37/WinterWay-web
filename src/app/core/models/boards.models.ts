export enum RollType {
    None,
    Day,
    Week,
    Month,
    Year,
    Custom
}

export enum RollStart {
    StartDate,
    CreationDate
}

export enum TaskType {
    Default,
    TodoList,
    NumericCounter,
    TextCounter,
    SumCounter
}

export class SprintResultModel {
    constructor(
        public id: number,
        public days: number,
        public tasksDone: number,
        public tasksSpill: number,
        public tasksClosed: number,
        public tasksToBacklog: number,
        public sprintId: number,
        public sprint?: SprintModel,
    ) {}
}

export class SprintModel {
    constructor(
        public id: number,
        public name: string,
        public active: boolean,
        public image: number,
        public number: number,
        public creationDate: Date,
        public boardId: number,
        public expirationDate?: Date,
        public closingDate?: Date,
        public board?: BoardModel,
        public sprintResults?: SprintResultModel,
        public tasks?: TaskModel[]
    ) {}
}

export class BoardModel {
    constructor(
        public id: number,
        public name: string,
        public rollType: RollType,
        public rollStart: RollStart,
        public rollDays: number,
        public currentSprintNumber: number,
        public isBacklog: boolean,
        public favorite: boolean,
        public archived: boolean,
        public sortOrder: number,
        public notificationActive: boolean,
        public creationDate: Date,
        public color?: string,
        public actualSprintId?: number,
        public actualSprint?: SprintModel,
        public allSprints?: SprintModel[],
        public allTasks?: TaskModel[],
    ) {}
}

export class TaskModel {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public type: TaskType,
        public isTemplate: boolean,
        public isDone: boolean,
        public autoComplete: boolean,
        public color: string,
        public maxCounter: number,
        public sortOrder: number,
        public creationDate: Date,
        public boardId: number,
        public board?: BoardModel,
        public closingDate?: Date,
        public sprintId?: number,
        public sprint?: SprintModel,
        public subtasks?: SubtaskModel[],
        public textCounters?: TextCounterModel[],
        public sumCounters?: SumCounterModel[],
        public numericCounter?: NumericCounterModel,
    ) {}
}

export class SubtaskModel {
    constructor(
        public id: number,
        public text: string,
        public isDone: boolean,
        public sortOrder: number,
        public taskId: number,
        public task?: TaskModel,
    ) {}
}

export class TextCounterModel {
    constructor(
        public id: number,
        public text: string,
        public sortOrder: number,
        public taskId: number,
        public task?: TaskModel,
    ) {}
}

export class SumCounterModel {
    constructor(
        public id: number,
        public text: string,
        public sum: number,
        public sortOrder: number,
        public taskId: number,
        public task?: TaskModel,
    ) {}
}

export class NumericCounterModel {
    constructor(
        public id: number,
        public name: string,
        public value: number,
        public taskId: number,
        public task?: TaskModel,
    ) {}
}
