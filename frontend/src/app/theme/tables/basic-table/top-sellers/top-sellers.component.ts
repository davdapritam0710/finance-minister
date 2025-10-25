import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-top-sellers:not(p)',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule],
    templateUrl: './top-sellers.component.html',
    styleUrl: './top-sellers.component.scss',
})
export class TopSellersComponent {
    constructor() {}
}
