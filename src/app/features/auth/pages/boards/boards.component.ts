import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'boards',
    templateUrl: './boards.component.html',
    imports: [
        RouterLink
    ],
    styleUrl: './boards.component.scss'
})
export class BoardsComponent {
    //
}
