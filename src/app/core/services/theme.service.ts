import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    changeTheme(theme: number) {
        document.body.setAttribute("data-bs-theme", theme === 0 ? 'light' : 'dark');
    }
}
