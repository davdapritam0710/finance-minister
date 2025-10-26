import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { UserRoutingModule } from './user-routing.module';
import { AuthInterceptor } from '../core/interceptors/auth.interceptor';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        UserRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
})
export class UserModule {}
