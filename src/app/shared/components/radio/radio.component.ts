import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ElementSize, ElementType } from '../../enums/element-types.enums';
import { RadioElement } from './radio.model';

@Component({
    standalone: true,
    selector: 'ww-radio',
    imports: [
        ButtonsModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WWRadioComponent),
            multi: true,
        },
    ],
    templateUrl: './radio.component.html',
    styleUrl: './radio.component.scss'
})
export class WWRadioComponent implements ControlValueAccessor {
    @Input() id: string = '';
    @Input() label: string = '';
    @Input() options: RadioElement[] = [];
    @Input() type: ElementType = ElementType.Primary;
    @Input() size: ElementSize = ElementSize.Medium;
    @Input() outline: boolean = false;
    @Input() disabled: boolean = false;

    value: string | number | boolean | null = null;

    private onChange = (value: string | number | boolean | null) => {};
    private onTouched = () => {};

    protected readonly String = String;

    get classes(): string[] {
        const classes = ['btn'];
        const outlineClass = this.outline ? 'outline-' : '';
        classes.push(`btn-${outlineClass}${this.type}`);
        if (this.size !== ElementSize.Medium) {
            classes.push(`btn-${this.size}`);
        }
        return classes;
    }

    writeValue(value: string | number | null): void {
        this.value = value;
    }

    registerOnChange(fn: (value: string | number | boolean | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    selectOption(value: string | number | boolean | null): void {
        if (!this.disabled) {
            this.value = value;
            this.onChange(value);
            this.onTouched();
        }
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
