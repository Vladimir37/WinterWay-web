import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function jsonValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const value = formGroup.value;

        try {
            JSON.parse(value);
            return null
        } catch (e) {
            return {
                invalidJson: true
            };
        }
    }
}
