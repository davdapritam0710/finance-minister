import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CustomizerSettingsService } from '@src/app/customizer-settings/customizer-settings.service';

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

    constructor(public themeService: CustomizerSettingsService) {
        this.themeService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }
}
