import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-profile-intro',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './profile-intro.component.html',
    styleUrl: './profile-intro.component.scss',
})
export class ProfileIntroComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
