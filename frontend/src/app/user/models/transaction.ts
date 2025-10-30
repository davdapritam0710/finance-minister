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
    type?: string;
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
