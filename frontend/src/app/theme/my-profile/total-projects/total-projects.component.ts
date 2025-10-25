import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-total-projects',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './total-projects.component.html',
    styleUrl: './total-projects.component.scss',
})
export class TotalProjectsComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
