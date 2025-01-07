import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const password = formGroup.get('Password')?.value;
        const repeatPassword = formGroup.get('RepeatPassword')?.value;

        if (password !== repeatPassword) {
            return {
                passwordMismatch: true,
            };
        }

        return null;
    }
}
