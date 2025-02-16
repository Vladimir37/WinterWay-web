import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[app-hover-delay]',
    standalone: true,
})
export class AppHoverDelayDirective {
    @Input() hoverDelayTime: number = 3000;
    @Output() hoverComplete = new EventEmitter();

    private hoverTimeout?: any = null;

    @HostListener('mouseenter')
    onMouseEnter() {
        this.hoverTimeout = setTimeout(() => {
            this.hoverComplete.emit();
        }, this.hoverDelayTime);
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }
    }
}
