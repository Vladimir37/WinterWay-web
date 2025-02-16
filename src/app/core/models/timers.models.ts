export class TimerModel {
    constructor(
        public id: number,
        public name: string,
        public archived: boolean,
        public notificationActive: boolean,
        public sortOrder: number,
        public creationDate: Date,
        public timerSessions: TimerSessionModel[],
        public color?: string,
    ) {}
}

export class TimerSessionModel {
    constructor(
        public id: number,
        public active: boolean,
        public creationDate: Date,
        public timerId: number,
        public stopDate?: Date,
    ) {}
}
