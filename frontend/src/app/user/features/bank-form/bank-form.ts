import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    Inject,
    OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BankService } from '../../services/bank.service';
import { Bank, CreateBankRequest, UpdateBankRequest } from '../../models/bank';
import { UserService } from '../../services/user.service';

export interface BankFormData {
    mode: 'add' | 'edit';
    bank?: Bank;
}

@Component({
    selector: 'app-bank-form',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatDialogContent,
        MatDialogActions,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './bank-form.html',
    styleUrl: './bank-form.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BankForm implements OnInit {
    bankForm: FormGroup;
    loading = false;
    isEditMode = false;

    // Options
    accountTypes = this.bankService.getAccountTypeOptions();
    currencies = this.userService.getCurrencyOptions();

    constructor(
        private fb: FormBuilder,
        private bankService: BankService,
        private userService: UserService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<BankForm>,
        @Inject(MAT_DIALOG_DATA) public data: BankFormData
    ) {
        this.isEditMode = data.mode === 'edit';
        this.bankForm = this.createForm();
    }

    ngOnInit() {
        if (this.isEditMode && this.data.bank) {
            this.populateForm(this.data.bank);
        }
    }

    createForm(): FormGroup {
        return this.fb.group({
            bankName: ['', [Validators.required, Validators.minLength(2)]],
            bankId: ['', [Validators.required]],
            accountHolderName: [''],
            accountNumber: [''],
            routingNumber: [''],
            accountType: ['checking', Validators.required],
            currency: ['INR'],
            country: ['IN'],
            balance: this.fb.group({
                current: [0, [Validators.min(0)]],
                available: [0, [Validators.min(0)]],
            }),
            status: ['pending'],
        });
    }

    populateForm(bank: Bank) {
        this.bankForm.patchValue({
            bankName: bank.bankName,
            bankId: bank.bankId,
            accountHolderName: bank.accountHolderName || '',
            accountNumber: '', // Don't populate account number for security
            routingNumber: '', // Don't populate routing number for security
            accountType: bank.accountType,
            currency: bank.currency,
            country: bank.country,
            balance: {
                current: bank.balance?.current || 0,
                available: bank.balance?.available || 0,
            },
            status: bank.status,
        });
    }

    onSubmit() {
        if (this.bankForm.valid) {
            this.loading = true;
            const formValue = this.bankForm.value;

            // Clean up empty fields
            const bankData: CreateBankRequest | UpdateBankRequest = {
                bankName: formValue.bankName,
                bankId: formValue.bankId,
                accountHolderName:
                    formValue.accountHolderName?.trim() || undefined,
                accountNumber: formValue.accountNumber?.trim() || undefined,
                routingNumber: formValue.routingNumber?.trim() || undefined,
                accountType: formValue.accountType,
                currency: formValue.currency,
                country: formValue.country,
                balance: {
                    current: formValue.balance?.current || 0,
                    available: formValue.balance?.available || 0,
                },
                status: formValue.status,
            };

            if (this.isEditMode && this.data.bank) {
                this.updateBank(bankData as UpdateBankRequest);
            } else {
                this.createBank(bankData as CreateBankRequest);
            }
        } else {
            this.markFormGroupTouched();
        }
    }

    createBank(data: CreateBankRequest) {
        this.bankService.createBank(data).subscribe({
            next: (response) => {
                this.loading = false;
                this.snackBar.open('Bank account added successfully', 'Close', {
                    duration: 3000,
                });
                this.dialogRef.close(true);
            },
            error: (error) => {
                console.error('Error creating bank:', error);
                this.loading = false;
                this.snackBar.open('Error adding bank account', 'Close', {
                    duration: 3000,
                });
            },
        });
    }

    updateBank(data: UpdateBankRequest) {
        if (this.data.bank) {
            this.bankService
                .updateBank(this.data.bank._id || this.data.bank.id || '', data)
                .subscribe({
                    next: (response) => {
                        this.loading = false;
                        this.snackBar.open(
                            'Bank account updated successfully',
                            'Close',
                            { duration: 3000 }
                        );
                        this.dialogRef.close(true);
                    },
                    error: (error) => {
                        console.error('Error updating bank:', error);
                        this.loading = false;
                        this.snackBar.open(
                            'Error updating bank account',
                            'Close',
                            { duration: 3000 }
                        );
                    },
                });
        }
    }

    onCancel() {
        this.dialogRef.close(false);
    }

    markFormGroupTouched() {
        Object.keys(this.bankForm.controls).forEach((key) => {
            const control = this.bankForm.get(key);
            control?.markAsTouched();
        });
    }

    getFieldError(fieldName: string): string {
        const field = this.bankForm.get(fieldName);
        if (field?.errors && field.touched) {
            if (field.errors['required']) {
                return `${fieldName} is required`;
            }
            if (field.errors['minlength']) {
                return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
            }
            if (field.errors['min']) {
                return `${fieldName} must be greater than or equal to ${field.errors['min'].min}`;
            }
        }
        return '';
    }
}
