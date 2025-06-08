export class ApiSuccessModel {
    constructor(
        public success: boolean,
        public operation: string,
        public info: string,
    ) {}
}
