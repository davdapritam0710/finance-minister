import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcommerceComponent } from './theme/dashboard/ecommerce/ecommerce.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'authentication',
        pathMatch: 'full',
    },
    { path: 'dashboard', component: EcommerceComponent },

    {
        path: 'authentication',
        loadChildren: () =>
            import('@src/app/authentication/auth.module').then(
                (m) => m.AuthModule
            ),
    },
    // {
    //   path: 'user',
    //   loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    // },
    // {
    //   path: 'admin',
    //   loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    // },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
