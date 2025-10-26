import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    HttpClientModule,
    provideHttpClient,
    withFetch,
    withInterceptors,
} from '@angular/common/http';

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule],
    providers: [
        // HTTP Client with fetch API for SSR
        provideHttpClient(withFetch(), withInterceptors([])),
        // Core services
        // HttpClientService,
        // AuthService,
        // AuthGuard,
        // GuestGuard,
    ],
    exports: [HttpClientModule],
})
export class CoreModule {}
