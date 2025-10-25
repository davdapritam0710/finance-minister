import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CustomizerSettingsService } from '@src/app/customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-top-sales-locations',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule],
    templateUrl: './top-sales-locations.component.html',
    styleUrl: './top-sales-locations.component.scss',
})
export class TopSalesLocationsComponent {
    // isToggled
    isToggled = false;

    constructor(public themeService: CustomizerSettingsService) {
        this.themeService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
}
