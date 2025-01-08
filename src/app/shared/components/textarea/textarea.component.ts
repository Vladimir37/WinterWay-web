import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSize, InputValidState } from '../input/input.enums';

@Component({
    standalone: true,
    selector: 'ww-textarea',
    imports: [
        NgIf,
        NgClass
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WWTextareaComponent),
            multi: true,
        },
    ],
    templateUrl: './textarea.component.html',
    styleUrl: './textarea.component.scss'
})
export class WWTextareaComponent implements ControlValueAccessor {
    @Input() id: string = 'default-textarea-id';
    @Input() label: string = '';
    @Input() size: number = 3;
    @Input() validState: InputValidState = InputValidState.None;
    @Input() validatorMessage: string = '';

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

    protected readonly InputValidState = InputValidState;
    protected readonly InputSize = InputSize;
}
