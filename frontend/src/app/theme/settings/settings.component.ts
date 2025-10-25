import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        RouterLink,
        RouterOutlet,
        MatCardModule,
        MatButtonModule,
        RouterLinkActive,
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
})
export class SettingsComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
