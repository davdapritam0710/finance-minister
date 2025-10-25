import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CustomizerSettingsService } from '@src/app/customizer-settings/customizer-settings.service';

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

    constructor(public themeService: CustomizerSettingsService) {
        this.themeService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
}
