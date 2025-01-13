import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(firstField: string = 'Password', secondField: string = 'RepeatPassword'): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const password = formGroup.get(firstField)?.value;
        const repeatPassword = formGroup.get(secondField)?.value;

        if (password !== repeatPassword) {
            return {
                passwordMismatch: true,
            };
        }

        return null;
    }
}
