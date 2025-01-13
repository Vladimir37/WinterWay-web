import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputValidState } from '../../shared/components/input/input.enums';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {
    checkFieldValidity(form: FormGroup, fieldName: string, additionalFactor: boolean = false): InputValidState {
        const targetField = form.controls[fieldName];
        if (targetField.touched && (targetField.invalid || additionalFactor)) {
            return InputValidState.Invalid;
        }
        return InputValidState.None;
    }

    checkPasswordMatch(form: FormGroup, fieldName: string): InputValidState {
        const targetField = form.controls[fieldName];
        if (form.errors?.['passwordMismatch'] && targetField.touched) {
            return InputValidState.Invalid;
        }
        return InputValidState.None;
    }
}
