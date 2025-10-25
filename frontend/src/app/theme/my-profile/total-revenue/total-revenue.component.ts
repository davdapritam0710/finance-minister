import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-total-revenue',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './total-revenue.component.html',
    styleUrl: './total-revenue.component.scss',
})
export class TotalRevenueComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
