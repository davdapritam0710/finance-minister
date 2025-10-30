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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TransactionService } from '../../services/transaction.service';
import {
    Transaction,
    CreateTransactionRequest,
    UpdateTransactionRequest,
} from '../../models/transaction';

export interface TransactionFormData {
    mode: 'add' | 'edit';
    transaction?: Transaction;
}

@Component({
    selector: 'app-transaction-form',
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
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './transaction-form.html',
    styleUrl: './transaction-form.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TransactionForm implements OnInit {
    transactionForm: FormGroup;
    loading = false;
    isEditMode = false;

    // Options
    transactionTypes = this.transactionService.getTransactionTypeOptions();
    categories = this.transactionService.getTransactionCategories();
    currencies = this.transactionService.getCurrencyOptions();
    sources = this.transactionService.getSourceOptions();

    constructor(
        private fb: FormBuilder,
        private transactionService: TransactionService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<TransactionForm>,
        @Inject(MAT_DIALOG_DATA) public data: TransactionFormData
    ) {
        this.isEditMode = data.mode === 'edit';
        this.transactionForm = this.createForm();
    }

    ngOnInit() {
        if (this.isEditMode && this.data.transaction) {
            this.populateForm(this.data.transaction);
        }
    }

    createForm(): FormGroup {
        return this.fb.group({
            type: ['', Validators.required],
            category: ['', Validators.required],
            amount: ['', [Validators.required, Validators.min(0.01)]],
            currency: ['INR'],
            accountName: [''],
            description: [''],
            date: [new Date(), Validators.required],
            tags: [[]],
            isRecurring: [false],
            source: ['manual'],
            externalId: [''],
        });
    }

    populateForm(transaction: Transaction) {
        this.transactionForm.patchValue({
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            currency: transaction.currency,
            accountName: transaction.accountName || '',
            description: transaction.description || '',
            date: new Date(transaction.date),
            tags: transaction.tags || [],
            isRecurring: transaction.isRecurring,
            source: transaction.source,
            externalId: transaction.externalId || '',
        });
    }

    onSubmit() {
        if (this.transactionForm.valid) {
            this.loading = true;
            const formValue = this.transactionForm.value;

            // Format date for API and clean up empty fields
            const transactionData = {
                ...formValue,
                date: formValue.date
                    ? new Date(formValue.date).toISOString().split('T')[0]
                    : undefined,
                // Remove empty strings for optional fields
                accountName: formValue.accountName?.trim() || undefined,
                description: formValue.description?.trim() || undefined,
            };

            if (this.isEditMode && this.data.transaction) {
                this.updateTransaction(transactionData);
            } else {
                this.createTransaction(transactionData);
            }
        } else {
            this.markFormGroupTouched();
        }
    }

    createTransaction(data: CreateTransactionRequest) {
        this.transactionService.createTransaction(data).subscribe({
            next: (response) => {
                this.loading = false;
                this.snackBar.open(
                    'Transaction created successfully',
                    'Close',
                    { duration: 3000 }
                );
                this.dialogRef.close(true);
            },
            error: (error) => {
                console.error('Error creating transaction:', error);
                this.loading = false;
                this.snackBar.open('Error creating transaction', 'Close', {
                    duration: 3000,
                });
            },
        });
    }

    updateTransaction(data: UpdateTransactionRequest) {
        if (this.data.transaction) {
            this.transactionService
                .updateTransaction(this.data.transaction._id, data)
                .subscribe({
                    next: (response) => {
                        this.loading = false;
                        this.snackBar.open(
                            'Transaction updated successfully',
                            'Close',
                            { duration: 3000 }
                        );
                        this.dialogRef.close(true);
                    },
                    error: (error) => {
                        console.error('Error updating transaction:', error);
                        this.loading = false;
                        this.snackBar.open(
                            'Error updating transaction',
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
        Object.keys(this.transactionForm.controls).forEach((key) => {
            const control = this.transactionForm.get(key);
            control?.markAsTouched();
        });
    }

    addTag(tagInput: HTMLInputElement) {
        const value = tagInput.value.trim();
        if (value) {
            const currentTags = this.transactionForm.get('tags')?.value || [];
            if (!currentTags.includes(value)) {
                this.transactionForm
                    .get('tags')
                    ?.setValue([...currentTags, value]);
            }
            tagInput.value = '';
        }
    }

    removeTag(tag: string) {
        const currentTags = this.transactionForm.get('tags')?.value || [];
        this.transactionForm
            .get('tags')
            ?.setValue(currentTags.filter((t: string) => t !== tag));
    }

    getCategoryIcon(category: string): string {
        return this.transactionService.getCategoryIcon(category);
    }

    getCategoryColor(category: string): string {
        return this.transactionService.getCategoryColor(category);
    }

    getFieldError(fieldName: string): string {
        const field = this.transactionForm.get(fieldName);
        if (field?.errors && field.touched) {
            if (field.errors['required']) {
                return `${fieldName} is required`;
            }
            if (field.errors['min']) {
                return `${fieldName} must be greater than 0`;
            }
        }
        return '';
    }
}
