import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { KYCFormComponent } from './kyc-form/kyc-form.component';

const routes: Routes = [
    {
        path: '',
        component: UserComponent,
    },
    {
        path: 'profile',
        component: UserComponent,
    },
    {
        path: 'kyc',
        component: KYCFormComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule {}
