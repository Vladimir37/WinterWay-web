import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputLabelType, InputSize, InputValidState } from './input.enums';

@Component({
    standalone: true,
    selector: 'ww-input',
    imports: [
        NgIf,
        NgClass,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WWInputComponent),
            multi: true,
        },
    ],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss'
})
export class WWInputComponent implements ControlValueAccessor {
    @Input() id: string = 'default-input-id';
    @Input() placeholder: string = '';
    @Input() type: string = 'text';
    @Input() label: string = '';
    @Input() labelType: InputLabelType = InputLabelType.Default;
    @Input() size: InputSize = InputSize.Medium;
    @Input() validState: InputValidState = InputValidState.None;
    @Input() validatorMessage: string = '';

    protected readonly InputLabelType = InputLabelType;
    protected readonly InputSize = InputSize;
    protected readonly InputValidState = InputValidState;

    value: string = '';
    isDisabled: boolean = false;

    onChange = (value: string) => {};
    onTouched = () => {};

    writeValue(value: string): void {
        this.value = value;
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    onInput(event: Event): void {
        if (!this.isDisabled) {
            const input = event.target as HTMLInputElement;
            this.value = input.value;
            this.onChange(input.value);
        }
    }
}
