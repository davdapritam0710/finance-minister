import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-recent-activity:not(p)',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule],
    templateUrl: './recent-activity.component.html',
    styleUrl: './recent-activity.component.scss',
})
export class RecentActivityComponent {
    // isToggled
    isToggled = false;

    constructor() {}
}
