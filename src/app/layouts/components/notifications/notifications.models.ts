enum NotificationType {
    TimeToRoll,
    CalendarRecordForToday,
    TaskCounterReachedMaxValue,
    DayOnTimer,
    WeekOnTimer,
    MonthOnTimer,
    YearOnTimer
}
enum NotificationEntity {
    Sprint,
    Calendar,
    TimerSession,
    Task
}

export class NotificationRequestDTO {
    constructor(
        public count: number,
        public skip: number,
        public read: boolean,
    ) {}
}

export class NotificationRequestWithoutReadDTO {
    constructor(
        public count: number,
        public skip: number
    ) {}
}

export class NotificationChangeRequestDTO {
    constructor(
        public notifications: number[],
    ) {}
}

export class Notification {
    constructor(
        public id: number,
        public message: string,
        public isRead: boolean,
        public archived: boolean,
        public entity: NotificationEntity,
        public entityId: number,
        public type: NotificationType,
        public creationDate: Date
    ) {}
}

export class NotificationResponseDTO {
    constructor(
        public unreadCount: number,
        public notifications: Notification[],
    ) {}
}
