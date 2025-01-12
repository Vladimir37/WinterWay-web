import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ElementSize, ElementType } from '../../enums/element-types.enums';

@Component({
    standalone: true,
    selector: 'ww-button',
    imports: [
        ButtonsModule,
        NgClass
    ],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class WWButtonComponent {
    @Input() label: string = '';
    @Input() type: ElementType = ElementType.Primary;
    @Input() size: ElementSize = ElementSize.Medium;
    @Input() outline: boolean = false;
    @Input() submit: boolean = false;
    @Input() disabled: boolean = false;

    @Output() clicked = new EventEmitter<string>();

    get buttonType(): string {
        if (this.submit) {
            return 'submit';
        }
        return 'button';
    }

    get classes(): string[] {
        const classes = ['btn'];
        const outlineClass = this.outline ? 'outline-' : '';
        classes.push(`btn-${outlineClass}${this.type}`);
        if (this.size !== ElementSize.Medium) {
            classes.push(`btn-${this.size}`);
        }
        return classes;
    }

    onClick(): void {
        this.clicked.emit();
    }
}
