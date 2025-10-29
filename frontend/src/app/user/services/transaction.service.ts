import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClientService } from '@src/app/core/services/http-client.service';

export interface Transaction {
    _id: string;
    userId: string;
    source:
        | 'manual'
        | 'plaid'
        | 'yodlee'
        | 'bank_api'
        | 'csv_import'
        | 'mobile_app';
    externalId?: string;
    type: 'credit' | 'debit';
    category: string;
    amount: number;
    currency: string;
    accountName?: string;
    description?: string;
    date: Date;
    tags: string[];
    isRecurring: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface TransactionSummary {
    totalCredit: number;
    totalDebit: number;
    netAmount: number;
    transactionCount: number;
}

export interface TransactionStats {
    period: 'week' | 'month' | 'year';
    dateRange: {
        startDate: Date;
        endDate: Date;
    };
    summary: TransactionSummary & {
        avgTransactionAmount: number;
    };
    categoryBreakdown: Array<{
        _id: string;
        totalAmount: number;
        count: number;
        creditAmount: number;
        debitAmount: number;
    }>;
}

export interface TransactionFilters {
    page?: number;
    limit?: number;
    type?: 'credit' | 'debit';
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface TransactionResponse {
    transactions: Transaction[];
    pagination: {
        current: number;
        pages: number;
        total: number;
    };
    summary: TransactionSummary;
}

export interface CreateTransactionRequest {
    type: 'credit' | 'debit';
    category: string;
    amount: number;
    currency?: string;
    accountName?: string;
    description?: string;
    date?: string;
    tags?: string[];
    isRecurring?: boolean;
    source?:
        | 'manual'
        | 'plaid'
        | 'yodlee'
        | 'bank_api'
        | 'csv_import'
        | 'mobile_app';
    externalId?: string;
}

export interface UpdateTransactionRequest {
    type?: 'credit' | 'debit';
    category?: string;
    amount?: number;
    currency?: string;
    accountName?: string;
    description?: string;
    date?: string;
    tags?: string[];
    isRecurring?: boolean;
    source?:
        | 'manual'
        | 'plaid'
        | 'yodlee'
        | 'bank_api'
        | 'csv_import'
        | 'mobile_app';
    externalId?: string;
}

@Injectable({
    providedIn: 'root',
})
export class TransactionService {
    constructor(private httpClient: HttpClientService) {}

    /**
     * Get all transactions for the current user
     */
    getTransactions(
        filters: TransactionFilters = {}
    ): Observable<TransactionResponse> {
        return this.httpClient
            .get<TransactionResponse>('api/transactions', filters)
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Get a single transaction by ID
     */
    getTransactionById(
        transactionId: string
    ): Observable<{ transaction: Transaction }> {
        return this.httpClient
            .get<{ transaction: Transaction }>(
                `api/transactions/${transactionId}`
            )
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Create a new transaction
     */
    createTransaction(
        transactionData: CreateTransactionRequest
    ): Observable<{ transaction: Transaction }> {
        return this.httpClient
            .post<{ transaction: Transaction }>(
                'api/transactions',
                transactionData
            )
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Update an existing transaction
     */
    updateTransaction(
        transactionId: string,
        transactionData: UpdateTransactionRequest
    ): Observable<{ transaction: Transaction }> {
        return this.httpClient
            .put<{ transaction: Transaction }>(
                `api/transactions/${transactionId}`,
                transactionData
            )
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Delete a transaction (soft delete)
     */
    deleteTransaction(transactionId: string): Observable<any> {
        return this.httpClient.delete(`api/transactions/${transactionId}`);
    }

    /**
     * Get transaction statistics
     */
    getTransactionStats(
        period: 'week' | 'month' | 'year' = 'month'
    ): Observable<TransactionStats> {
        return this.httpClient
            .get<TransactionStats>('api/transactions/stats', { period })
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Get transaction type options
     */
    getTransactionTypeOptions(): Array<{
        value: string;
        label: string;
        icon: string;
    }> {
        return [
            { value: 'credit', label: 'Credit', icon: 'trending_up' },
            { value: 'debit', label: 'Debit', icon: 'trending_down' },
        ];
    }

    /**
     * Get currency options
     */
    getCurrencyOptions(): Array<{
        value: string;
        label: string;
        symbol: string;
    }> {
        return [
            { value: 'USD', label: 'US Dollar', symbol: '$' },
            { value: 'EUR', label: 'Euro', symbol: '€' },
            { value: 'GBP', label: 'British Pound', symbol: '£' },
            { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
            { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
            { value: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
            { value: 'CHF', label: 'Swiss Franc', symbol: 'CHF' },
            { value: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
            { value: 'INR', label: 'Indian Rupee', symbol: '₹' },
            { value: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
            { value: 'SGD', label: 'Singapore Dollar', symbol: 'S$' },
            { value: 'HKD', label: 'Hong Kong Dollar', symbol: 'HK$' },
            { value: 'NZD', label: 'New Zealand Dollar', symbol: 'NZ$' },
            { value: 'SEK', label: 'Swedish Krona', symbol: 'kr' },
            { value: 'NOK', label: 'Norwegian Krone', symbol: 'kr' },
            { value: 'DKK', label: 'Danish Krone', symbol: 'kr' },
            { value: 'PLN', label: 'Polish Zloty', symbol: 'zł' },
            { value: 'CZK', label: 'Czech Koruna', symbol: 'Kč' },
            { value: 'HUF', label: 'Hungarian Forint', symbol: 'Ft' },
            { value: 'RUB', label: 'Russian Ruble', symbol: '₽' },
            { value: 'BRL', label: 'Brazilian Real', symbol: 'R$' },
            { value: 'MXN', label: 'Mexican Peso', symbol: '$' },
            { value: 'ZAR', label: 'South African Rand', symbol: 'R' },
            { value: 'KRW', label: 'South Korean Won', symbol: '₩' },
            { value: 'THB', label: 'Thai Baht', symbol: '฿' },
            { value: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM' },
            { value: 'IDR', label: 'Indonesian Rupiah', symbol: 'Rp' },
            { value: 'PHP', label: 'Philippine Peso', symbol: '₱' },
            { value: 'VND', label: 'Vietnamese Dong', symbol: '₫' },
            { value: 'TRY', label: 'Turkish Lira', symbol: '₺' },
            { value: 'ILS', label: 'Israeli Shekel', symbol: '₪' },
        ];
    }

    /**
     * Get common transaction categories
     */
    getTransactionCategories(): Array<{
        value: string;
        label: string;
        icon: string;
        color: string;
    }> {
        return [
            // Income Categories
            {
                value: 'salary',
                label: 'Salary',
                icon: 'work',
                color: '#4CAF50',
            },
            {
                value: 'freelance',
                label: 'Freelance',
                icon: 'laptop',
                color: '#2196F3',
            },
            {
                value: 'investment',
                label: 'Investment Returns',
                icon: 'trending_up',
                color: '#FF9800',
            },
            { value: 'bonus', label: 'Bonus', icon: 'stars', color: '#9C27B0' },
            {
                value: 'gift',
                label: 'Gift',
                icon: 'card_giftcard',
                color: '#E91E63',
            },
            {
                value: 'refund',
                label: 'Refund',
                icon: 'undo',
                color: '#607D8B',
            },
            {
                value: 'other_income',
                label: 'Other Income',
                icon: 'add_circle',
                color: '#795548',
            },

            // Expense Categories
            {
                value: 'food',
                label: 'Food & Dining',
                icon: 'restaurant',
                color: '#FF5722',
            },
            {
                value: 'transportation',
                label: 'Transportation',
                icon: 'directions_car',
                color: '#3F51B5',
            },
            {
                value: 'housing',
                label: 'Housing',
                icon: 'home',
                color: '#8BC34A',
            },
            {
                value: 'utilities',
                label: 'Utilities',
                icon: 'flash_on',
                color: '#FFC107',
            },
            {
                value: 'healthcare',
                label: 'Healthcare',
                icon: 'local_hospital',
                color: '#F44336',
            },
            {
                value: 'entertainment',
                label: 'Entertainment',
                icon: 'movie',
                color: '#9C27B0',
            },
            {
                value: 'shopping',
                label: 'Shopping',
                icon: 'shopping_bag',
                color: '#E91E63',
            },
            {
                value: 'education',
                label: 'Education',
                icon: 'school',
                color: '#2196F3',
            },
            {
                value: 'insurance',
                label: 'Insurance',
                icon: 'security',
                color: '#607D8B',
            },
            {
                value: 'subscriptions',
                label: 'Subscriptions',
                icon: 'subscriptions',
                color: '#795548',
            },
            {
                value: 'travel',
                label: 'Travel',
                icon: 'flight',
                color: '#00BCD4',
            },
            {
                value: 'charity',
                label: 'Charity',
                icon: 'favorite',
                color: '#E91E63',
            },
            {
                value: 'savings',
                label: 'Savings',
                icon: 'savings',
                color: '#4CAF50',
            },
            {
                value: 'debt_payment',
                label: 'Debt Payment',
                icon: 'credit_card',
                color: '#FF9800',
            },
            {
                value: 'other_expense',
                label: 'Other Expense',
                icon: 'remove_circle',
                color: '#9E9E9E',
            },
        ];
    }

    /**
     * Get source options
     */
    getSourceOptions(): Array<{ value: string; label: string; icon: string }> {
        return [
            { value: 'manual', label: 'Manual Entry', icon: 'edit' },
            {
                value: 'plaid',
                label: 'Plaid Integration',
                icon: 'account_balance',
            },
            {
                value: 'yodlee',
                label: 'Yodlee Integration',
                icon: 'account_balance',
            },
            { value: 'bank_api', label: 'Bank API', icon: 'api' },
            { value: 'csv_import', label: 'CSV Import', icon: 'upload_file' },
            { value: 'mobile_app', label: 'Mobile App', icon: 'phone_android' },
        ];
    }

    /**
     * Get period options for statistics
     */
    getPeriodOptions(): Array<{ value: string; label: string; icon: string }> {
        return [
            { value: 'week', label: 'This Week', icon: 'date_range' },
            { value: 'month', label: 'This Month', icon: 'calendar_month' },
            { value: 'year', label: 'This Year', icon: 'calendar_today' },
        ];
    }

    /**
     * Format currency amount
     */
    formatCurrency(amount: number, currency: string = 'INR'): string {
        const currencySymbols: { [key: string]: string } = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            JPY: '¥',
            CAD: 'C$',
            AUD: 'A$',
            CHF: 'CHF',
            CNY: '¥',
            INR: '₹',
            AED: 'د.إ',
            SGD: 'S$',
            HKD: 'HK$',
            NZD: 'NZ$',
            SEK: 'kr',
            NOK: 'kr',
            DKK: 'kr',
            PLN: 'zł',
            CZK: 'Kč',
            HUF: 'Ft',
            RUB: '₽',
            BRL: 'R$',
            MXN: '$',
            ZAR: 'R',
            KRW: '₩',
            THB: '฿',
            MYR: 'RM',
            IDR: 'Rp',
            PHP: '₱',
            VND: '₫',
            TRY: '₺',
            ILS: '₪',
        };

        const symbol = currencySymbols[currency] || currency;
        return `${symbol}${amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    /**
     * Format date for display
     */
    formatDate(date: Date | string): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    /**
     * Format date for form input
     */
    formatDateForInput(date: Date | string): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toISOString().split('T')[0];
    }

    /**
     * Get category color
     */
    getCategoryColor(category: string): string {
        const categories = this.getTransactionCategories();
        const categoryData = categories.find((cat) => cat.value === category);
        return categoryData?.color || '#9E9E9E';
    }

    /**
     * Get category icon
     */
    getCategoryIcon(category: string): string {
        const categories = this.getTransactionCategories();
        const categoryData = categories.find((cat) => cat.value === category);
        return categoryData?.icon || 'category';
    }
}
