import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    standalone: true,
    selector: 'ww-textarea',
    imports: [NgIf],
    templateUrl: './textarea.component.html',
    styleUrl: './textarea.component.scss'
})
export class WWTextareaComponent {
    @Input() model!: string;
    @Input() id: string = 'default-textarea-id';
    @Input() label: string = '';
    @Input() size: number = 3;

    @Input() disabled: boolean = false;

    @Output() modelChange = new EventEmitter<string>();

    onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.modelChange.emit(input.value);
    }
}
