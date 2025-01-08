import { Component, Input } from '@angular/core';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { AlertType } from './alert.enums';

@Component({
    standalone: true,
    selector: 'ww-alert',
    imports: [
        NgIf,
        NgClass,
        NgStyle,
    ],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss'
})
export class WWAlertComponent {
    @Input() alertType: AlertType = AlertType.Info;
    @Input() title: string | null = null;
    @Input() subtitle: string | null = null;
    @Input() text: string | null = null;
    @Input() lineHeight: number = 1;

    protected readonly AlertType = AlertType;

    get minHeightStyles() {
        return {
            'min-height': `${(this.lineHeight * 1.5) + 2}em`
        };
    }
}
