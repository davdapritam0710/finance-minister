import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
    // Password Hide
    hide = true;
    hide2 = true;
    hide3 = true;

    // isToggled
    isToggled = false;

    constructor() {}
}
