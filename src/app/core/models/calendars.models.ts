export enum CalendarType {
    Boolean,
    Numeric,
    Time,
    Fixed
}

export class CalendarModel {
    constructor(
        public id: number,
        public name: string,
        public type: CalendarType,
        public color: string,
        public serializedDefaultValue: string,
        public sortOrder: number,
        public archived: boolean,
        public notificationActive: boolean,
        public creationDate: Date,
        public calendarRecords: CalendarRecordModel[],
        public calendarValues: CalendarValueModel[],
        public archivingDate?: Date,
    ) {}
}

export class CalendarValueModel {
    constructor(
        public id: number,
        public name: string,
        public color: string,
        public archived: boolean,
        public sortOrder: number,
        public calendarId: number,
    ) {}
}

export class CalendarRecordModel {
    constructor(
        public id: number,
        public date: Date,
        public calendarId: number,
        public serializedValue?: string,
        public text?: string,
        public fixedValueId?: number,
        public fixedValue?: CalendarValueModel,
    ) {}
}
