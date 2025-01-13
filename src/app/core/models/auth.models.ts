export class LoginDTO {
    constructor(
        public Username: string,
        public Password: string
    ) {}
}

export class RegistrationDTO {
    constructor(
        public Username: string,
        public Password: string
    ) {}
}

export class EditUserDTO {
    constructor(
        public Username: string,
        public Theme: string,
        public AutoCompleteTasks: string
    ) {}
}

export class ChangePasswordDTO {
    constructor(
        public OldPassword: string,
        public NewPassword: string,
    ) {}
}
