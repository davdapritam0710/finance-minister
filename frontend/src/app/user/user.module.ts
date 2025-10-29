import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Material Modules
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { KYCFormComponent } from './pages/kyc-form/kyc-form.component';
import { TransactionList } from './pages/transaction-list/transaction-list';
import { TransactionForm } from './pages/transaction-form/transaction-form';
import { UserService } from './services/user.service';
import { KYCService } from './services/kyc.service';
import { TransactionService } from './services/transaction.service';

@NgModule({
    declarations: [UserComponent, KYCFormComponent],
    imports: [
        CommonModule,
        UserRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        MatTabsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatIconModule,
        MatSnackBarModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule,
        MatProgressBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        // Standalone components
        TransactionList,
        TransactionForm,
    ],
    providers: [UserService, KYCService, TransactionService],
})
export class UserModule {}
