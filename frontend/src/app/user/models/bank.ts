export interface Bank {
    _id?: string;
    id?: string;
    user?: string;
    bankName: string;
    bankId: string;
    accountHolderName?: string;
    accountNumber?: string;
    maskedAccount?: string;
    routingNumber?: string;
    accountType: 'checking' | 'savings' | 'credit' | 'loan' | 'other';
    currency: string;
    country: string;
    balance?: {
        current?: number;
        available?: number;
        lastUpdatedAt?: Date | string | null;
    };
    status: 'linked' | 'pending' | 'failed' | 'disabled' | 'unlinked';
    linkedAt?: Date | string | null;
    unlinkedAt?: Date | string | null;
    deleted?: boolean;
    deletedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface BankFilters {
    page?: number;
    limit?: number;
    status?: string;
    accountType?: string;
    currency?: string;
    search?: string;
}

export interface BankResponse {
    banks: Bank[];
    pagination: {
        current: number;
        pages: number;
        total: number;
    };
}

export interface CreateBankRequest {
    bankName: string;
    bankId: string;
    accountHolderName?: string;
    accountNumber?: string;
    routingNumber?: string;
    accountType?: 'checking' | 'savings' | 'credit' | 'loan' | 'other';
    currency?: string;
    country?: string;
    balance?: {
        current?: number;
        available?: number;
    };
    status?: 'linked' | 'pending' | 'failed' | 'disabled' | 'unlinked';
}

export interface UpdateBankRequest {
    bankName?: string;
    bankId?: string;
    accountHolderName?: string;
    accountNumber?: string;
    routingNumber?: string;
    accountType?: 'checking' | 'savings' | 'credit' | 'loan' | 'other';
    currency?: string;
    country?: string;
    balance?: {
        current?: number;
        available?: number;
    };
    status?: 'linked' | 'pending' | 'failed' | 'disabled' | 'unlinked';
}

export interface UpdateBalanceRequest {
    current?: number;
    available?: number;
}
