import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './privacy-policy.component.html',
    styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
