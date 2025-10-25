import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-terms-conditions',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './terms-conditions.component.html',
    styleUrl: './terms-conditions.component.scss',
})
export class TermsConditionsComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
