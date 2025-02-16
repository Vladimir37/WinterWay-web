import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[app-click-outside]',
    standalone: true,
})
export class AppClickOutsideDirective {
    @Input() isActive: boolean = false;
    @Output() clickOutside: EventEmitter<any> = new EventEmitter();

    constructor(private elementRef: ElementRef) {}

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.handleClickOutside(event);
        }
    }

    handleClickOutside(event: MouseEvent): void {
        this.clickOutside.emit(event);
    }
}
