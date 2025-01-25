import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PreloaderColor } from './preloader.enums';
import { ThemeService } from '../../../core/services/theme.service';

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
    @Input() color: PreloaderColor = PreloaderColor.Theme;
    @Input() small: boolean = false;

    constructor(private themeService: ThemeService) {}

    get imageUrl(): string {
        if (
            this.color == PreloaderColor.White ||
            (this.color == PreloaderColor.Theme && this.themeService.activeTheme == 1)
        ) {
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
