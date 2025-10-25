import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatMenuModule, MatTooltipModule],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})
export class UsersComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
