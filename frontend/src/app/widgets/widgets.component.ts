import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TotalSalesComponent } from '../dashboard/ecommerce/total-sales/total-sales.component';
import { TotalOrdersComponent } from '../dashboard/ecommerce/total-orders/total-orders.component';
import { TotalCustomersComponent } from '../dashboard/ecommerce/total-customers/total-customers.component';
import { TotalRevenueComponent } from '../dashboard/ecommerce/total-revenue/total-revenue.component';
import { SalesOverviewComponent } from '../dashboard/ecommerce/sales-overview/sales-overview.component';

@Component({
    selector: 'app-widgets',
    standalone: true,
    imports: [
        RouterLink,
        TotalSalesComponent,
        TotalOrdersComponent,
        TotalCustomersComponent,
        TotalRevenueComponent,
        SalesOverviewComponent,
    ],
    templateUrl: './widgets.component.html',
    styleUrl: './widgets.component.scss',
})
export class WidgetsComponent {}
