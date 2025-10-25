import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-new-customers-this-month',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './new-customers-this-month.component.html',
    styleUrl: './new-customers-this-month.component.scss',
})
export class NewCustomersThisMonthComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
