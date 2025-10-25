import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-total-projects',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './total-projects.component.html',
    styleUrl: './total-projects.component.scss',
})
export class TotalProjectsComponent {
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
