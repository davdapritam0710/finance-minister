import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { KYCFormComponent } from './pages/kyc-form/kyc-form.component';
import { TransactionList } from './pages/transaction-list/transaction-list';

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
    {
        path: 'transactions',
        component: TransactionList,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule {}
