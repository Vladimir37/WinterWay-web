import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ButtonSize, ButtonType } from './button.enums';

@Component({
    standalone: true,
    selector: 'ww-button',
    imports: [
        ButtonsModule,
        // NgIf,
        NgClass
    ],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class WWButtonComponent {
    @Input() label: string = '';
    @Input() type: ButtonType = ButtonType.Primary;
    @Input() size: ButtonSize = ButtonSize.Medium;
    @Input() outline: boolean = false;
    @Input() disabled: boolean = false;

    @Output() clicked = new EventEmitter<string>();

    onClick(): void {
        this.clicked.emit();
    }

    getClasses(): string[] {
        const classes = ['btn'];
        const outlineClass = this.outline ? 'outline-' : '';
        classes.push(`btn-${outlineClass}${this.type}`);
        if (this.size !== ButtonSize.Medium) {
            classes.push(`btn-${this.size}`);
        }
        return classes;
    }
}
