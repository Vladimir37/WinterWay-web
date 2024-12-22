import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { AlertType } from './alert.enums';

@Component({
    standalone: true,
    selector: 'ww-alert',
    imports: [
        NgIf,
        NgClass,
    ],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss'
})
export class WWAlertComponent {
    @Input() alertType: AlertType = AlertType.Info;
    @Input() title: string | null = null;
    @Input() subtitle: string | null = null;
    @Input() text: string | null = null;

    protected readonly AlertType = AlertType;
}
