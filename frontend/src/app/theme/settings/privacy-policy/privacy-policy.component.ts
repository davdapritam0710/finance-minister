import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CustomizerSettingsService } from '@src/app/customizer-settings/customizer-settings.service';

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
