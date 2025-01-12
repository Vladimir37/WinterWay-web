import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
    standalone: true,
    selector: 'ww-preloader',
    templateUrl: './preloader.component.html',
    imports: [
        NgOptimizedImage
    ],
    styleUrl: './preloader.component.scss'
})
export class WWPreloaderComponent {
    @Input() isWhite: boolean = false;
    @Input() small: boolean = false;

    get imageUrl(): string {
        if (this.isWhite) {
            return '/images/icons/preloaders/preload-moon-white.gif';
        }
        return '/images/icons/preloaders/preload-moon-black.gif';
    }

    get imageSize(): number {
        if (this.small) {
            return 32;
        }
        return 64;
    }
}
