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
        public Count: number,
        public Skip: number,
        public Read: boolean,
    ) {}
}

export class NotificationChangeRequestDTO {
    constructor(
        public Notifications: number[],
    ) {}
}

export class Notification {
    constructor(
        public Id: number,
        public Message: string,
        public IsRead: boolean,
        public Archived: boolean,
        public Entity: NotificationEntity,
        public EntityId: number,
        public Type: NotificationType,
        public CreationDate: Date
    ) {}
}
