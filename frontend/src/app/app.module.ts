import {
    NgModule,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import {
    BrowserModule,
    provideClientHydration,
    withEventReplay,
} from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        SidebarComponent,
        HeaderComponent,
        FooterComponent,
        // CoreModule,
        // ToastrModule.forRoot({
        //   positionClass: 'toast-top-right',
        //   preventDuplicates: true,
        // }),
    ],
    providers: [
        provideAnimations(),
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideClientHydration(withEventReplay()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        // provideToastr(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
