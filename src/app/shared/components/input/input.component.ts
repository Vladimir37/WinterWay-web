import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { InputLabelType, InputSize, InputValidState } from './input.enums';

@Component({
    standalone: true,
    selector: 'ww-input',
    imports: [
        NgIf,
        NgClass
    ],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss'
})
export class WWInputComponent {
    @Input() model!: string;
    @Input() id: string = 'default-input-id';
    @Input() placeholder: string = '';
    @Input() type: string = 'text';
    @Input() label: string = '';
    @Input() labelType: InputLabelType = InputLabelType.Default;
    @Input() size: InputSize = InputSize.Medium;
    @Input() validState: InputValidState = InputValidState.None;
    @Input() validatorMessage: string = '';
    @Input() disabled: boolean = false;

    @Output() modelChange = new EventEmitter<string>();

    protected readonly InputLabelType = InputLabelType;
    protected readonly InputSize = InputSize;
    protected readonly InputValidState = InputValidState;

    onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.modelChange.emit(input.value);
    }
}
