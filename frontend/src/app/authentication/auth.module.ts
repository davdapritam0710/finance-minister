import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from '@src/app/authentication/auth-routing.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, ReactiveFormsModule, AuthRoutingModule],
    providers: [],
})
export class AuthModule {}
