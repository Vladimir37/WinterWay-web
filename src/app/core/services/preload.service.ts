import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PreloadService {
    private importantImages: string[] = [
        '/images/logos/logo.svg',
        '/images/icons/bell.svg',
        '/images/icons/preloaders/preload-moon-white.gif',
        '/images/icons/preloaders/preload-moon-black.gif',
        '/images/icons/cross-black.svg',
        '/images/icons/cross-white.svg',
        '/images/icons/cross-hover.svg'
    ];

    preloadImages() {
        this.importantImages.forEach((elem) => {
            (new Image()).src = elem;
        });
    }
}
