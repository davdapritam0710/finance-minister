import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-remixicon',
    standalone: true,
    imports: [RouterLink, MatMenuModule, MatButtonModule, MatCardModule],
    templateUrl: './remixicon.component.html',
    styleUrl: './remixicon.component.scss',
})
export class RemixiconComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
