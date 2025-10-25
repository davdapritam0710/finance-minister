import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-material-symbols',
    standalone: true,
    imports: [RouterLink, MatMenuModule, MatButtonModule, MatCardModule],
    templateUrl: './material-symbols.component.html',
    styleUrl: './material-symbols.component.scss',
})
export class MaterialSymbolsComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
