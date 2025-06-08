export class TimerCounter {
    constructor(
        public isActive: boolean,
        public times: TimerCounterMeasurements
    ) {}
}

class TimerCounterMeasurements {
    constructor(
        public years: string,
        public months: string,
        public days: string,
        public hours: number,
        public minutes: number,
        public seconds: number
    ) {}
}
