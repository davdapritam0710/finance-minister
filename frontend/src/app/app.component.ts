declare let $: any;
import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { ToggleService } from '../app/common/sidebar/toggle.service';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import {
    CommonModule,
    Location,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import {
    RouterOutlet,
    Router,
    NavigationCancel,
    NavigationEnd,
} from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        HeaderComponent,
        FooterComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [
        Location,
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy,
        },
    ],
})
export class AppComponent {
    title = 'Daxa -  Angular 17 Material Design Admin Dashboard Template';
    routerSubscription: any;
    location: any;

    // isSidebarToggled
    isSidebarToggled = false;

    // isToggled
    isToggled = false;

    constructor(public router: Router, private toggleService: ToggleService) {
        this.toggleService.isSidebarToggled$.subscribe((isSidebarToggled) => {
            this.isSidebarToggled = isSidebarToggled;
        });
    }

    // ngOnInit
    ngOnInit() {
        this.recallJsFuntions();
    }

    // recallJsFuntions
    recallJsFuntions() {
        this.routerSubscription = this.router.events
            .pipe(
                filter(
                    (event) =>
                        event instanceof NavigationEnd ||
                        event instanceof NavigationCancel
                )
            )
            .subscribe((event) => {
                this.location = this.router.url;
                if (!(event instanceof NavigationEnd)) {
                    return;
                }
                window.scrollTo(0, 0);
            });
    }
}
