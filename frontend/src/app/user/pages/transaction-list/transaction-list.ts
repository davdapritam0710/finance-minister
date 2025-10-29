import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
    TransactionService,
    Transaction,
    TransactionFilters,
    TransactionResponse,
} from '../../services/transaction.service';
import { TransactionForm } from '../transaction-form/transaction-form';

@Component({
    selector: 'app-transaction-list',
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
    ],
    templateUrl: './transaction-list.html',
    styleUrl: './transaction-list.scss',
})
export class TransactionList implements OnInit {
    displayedColumns: string[] = ['transaction', 'amount', 'date', 'actions'];
    dataSource = new MatTableDataSource<Transaction>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // Data properties
    transactions: Transaction[] = [];
    loading = false;
    totalTransactions = 0;
    currentPage = 1;
    pageSize = 10;

    // Summary data
    summary = {
        totalCredit: 0,
        totalDebit: 0,
        netAmount: 0,
        transactionCount: 0,
    };

    // Filter properties
    filters: TransactionFilters = {
        page: 1,
        limit: 10,
        type: undefined,
        category: '',
        startDate: '',
        endDate: '',
        search: '',
    };

    // Filter form
    filterForm = {
        type: '',
        category: '',
        search: '',
        startDate: '',
        endDate: '',
    };

    // Options
    transactionTypes = this.transactionService.getTransactionTypeOptions();
    categories = this.transactionService.getTransactionCategories();
    currencies = this.transactionService.getCurrencyOptions();

    constructor(
        private transactionService: TransactionService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.loadTransactions();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    loadTransactions() {
        this.loading = true;
        this.transactionService.getTransactions(this.filters).subscribe({
            next: (response: TransactionResponse) => {
                console.log('Transaction response:', response); // Debug log
                this.transactions = response.transactions || [];
                this.dataSource.data = this.transactions;
                this.totalTransactions = response.pagination?.total || 0;
                this.currentPage = response.pagination?.current || 1;

                // Ensure summary data is properly set
                this.summary = {
                    totalCredit: response.summary?.totalCredit || 0,
                    totalDebit: response.summary?.totalDebit || 0,
                    netAmount: response.summary?.netAmount || 0,
                    transactionCount: response.summary?.transactionCount || 0,
                };

                console.log('Summary data:', this.summary); // Debug log
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading transactions:', error);
                this.snackBar.open('Error loading transactions', 'Close', {
                    duration: 3000,
                });
                this.loading = false;
            },
        });
    }

    onPageChange(event: any) {
        this.filters.page = event.pageIndex + 1;
        this.filters.limit = event.pageSize;
        this.loadTransactions();
    }

    applyFilters() {
        this.filters = {
            page: 1,
            limit: this.pageSize,
            type: (this.filterForm.type as 'credit' | 'debit') || undefined,
            category: this.filterForm.category || undefined,
            search: this.filterForm.search || undefined,
            startDate: this.filterForm.startDate || undefined,
            endDate: this.filterForm.endDate || undefined,
        };
        this.loadTransactions();
    }

    clearFilters() {
        this.filterForm = {
            type: '',
            category: '',
            search: '',
            startDate: '',
            endDate: '',
        };
        this.filters = {
            page: 1,
            limit: this.pageSize,
        };
        this.loadTransactions();
    }

    openAddTransactionDialog() {
        const dialogRef = this.dialog.open(TransactionForm, {
            width: '600px',
            data: { mode: 'add' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadTransactions();
            }
        });
    }

    openEditTransactionDialog(transaction: Transaction) {
        const dialogRef = this.dialog.open(TransactionForm, {
            width: '600px',
            data: { mode: 'edit', transaction },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadTransactions();
            }
        });
    }

    deleteTransaction(transaction: Transaction) {
        if (confirm(`Are you sure you want to delete this transaction?`)) {
            this.transactionService
                .deleteTransaction(transaction._id)
                .subscribe({
                    next: () => {
                        this.snackBar.open(
                            'Transaction deleted successfully',
                            'Close',
                            { duration: 3000 }
                        );
                        this.loadTransactions();
                    },
                    error: (error) => {
                        console.error('Error deleting transaction:', error);
                        this.snackBar.open(
                            'Error deleting transaction',
                            'Close',
                            { duration: 3000 }
                        );
                    },
                });
        }
    }

    getCategoryIcon(category: string): string {
        return this.transactionService.getCategoryIcon(category);
    }

    getCategoryColor(category: string): string {
        return this.transactionService.getCategoryColor(category);
    }

    formatCurrency(amount: number, currency: string): string {
        return this.transactionService.formatCurrency(amount, currency);
    }

    formatDate(date: Date | string): string {
        return this.transactionService.formatDate(date);
    }

    getTransactionTypeIcon(type: string): string {
        return type === 'credit' ? 'trending_up' : 'trending_down';
    }

    getTransactionTypeColor(type: string): string {
        return type === 'credit' ? '#4CAF50' : '#F44336';
    }
}
