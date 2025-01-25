import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private _activeTheme: number = 0;

    get activeTheme(): number {
        return this._activeTheme;
    }

    changeTheme(theme: number) {
        this._activeTheme = theme;
        document.body.setAttribute("data-bs-theme", theme === 0 ? 'light' : 'dark');
        const elements = document.querySelectorAll('.ww-theme-container');
        elements.forEach((el) => {
            el.setAttribute("data-bs-theme", theme === 0 ? 'light' : 'dark');
        })
    }
}
