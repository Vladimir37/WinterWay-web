export class AppStatusModel {
    constructor(
        public appName: string,
        public appVersion: string,
        public registrationIsPossible: boolean,
        public registrationIsAvailable: boolean,
        public importIsAvailable: boolean
    ) {}
}

class BackgroundCount {
    constructor(
        public backlog: number,
        public days: number,
        public months: number,
        public none: number,
        public other: number,
        public empty: number
    ) {}
}

export class BackgroundStatusModel {
    constructor(
        public serverURL: string,
        public name: string,
        public dir: string,
        public extension: string,
        public count: BackgroundCount
    ) {}
}

export class UserStatusModel {
    constructor(
        public id: string,
        public username: string,
        public themeType: number,
        public defaultAutocomplete: boolean,
    ) {}
}
