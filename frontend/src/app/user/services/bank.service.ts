import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClientService } from '@src/app/core/services/http-client.service';
import {
    Bank,
    BankFilters,
    BankResponse,
    CreateBankRequest,
    UpdateBankRequest,
    UpdateBalanceRequest,
} from '../models/bank';

@Injectable({
    providedIn: 'root',
})
export class BankService {
    constructor(private httpClient: HttpClientService) {}

    /**
     * Get all banks for the current user
     */
    getBanks(filters: BankFilters = {}): Observable<BankResponse> {
        return this.httpClient
            .get<BankResponse>('api/banks', filters)
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Get a single bank by ID
     */
    getBankById(bankId: string): Observable<{ bank: Bank }> {
        return this.httpClient
            .get<{ bank: Bank }>(`api/banks/${bankId}`)
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Create a new bank
     */
    createBank(bankData: CreateBankRequest): Observable<{ bank: Bank }> {
        return this.httpClient
            .post<{ bank: Bank }>('api/banks', bankData)
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Update an existing bank
     */
    updateBank(
        bankId: string,
        bankData: UpdateBankRequest
    ): Observable<{ bank: Bank }> {
        return this.httpClient
            .put<{ bank: Bank }>(`api/banks/${bankId}`, bankData)
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Delete a bank (soft delete)
     */
    deleteBank(bankId: string): Observable<any> {
        return this.httpClient.delete(`api/banks/${bankId}`);
    }

    /**
     * Update bank balance
     */
    updateBankBalance(
        bankId: string,
        balanceData: UpdateBalanceRequest
    ): Observable<{ bank: Bank }> {
        return this.httpClient
            .patch<{ bank: Bank }>(`api/banks/${bankId}/balance`, balanceData)
            .pipe(map((response: any) => response.data || (response as any)));
    }

    /**
     * Link a bank
     */
    linkBank(bankId: string): Observable<{ bank: Bank }> {
        return this.httpClient
            .patch<{ bank: Bank }>(`api/banks/${bankId}/link`, {})
            .pipe(map((response: any) => response.data || (response as any)));
    }

    /**
     * Unlink a bank
     */
    unlinkBank(bankId: string): Observable<{ bank: Bank }> {
        return this.httpClient
            .patch<{ bank: Bank }>(`api/banks/${bankId}/unlink`, {})
            .pipe(map((response: any) => response.data || (response as any)));
    }

    /**
     * Get account type options
     */
    getAccountTypeOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'checking', label: 'Checking' },
            { value: 'savings', label: 'Savings' },
            { value: 'credit', label: 'Credit' },
            { value: 'loan', label: 'Loan' },
            { value: 'other', label: 'Other' },
        ];
    }

    /**
     * Get status options
     */
    getStatusOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'linked', label: 'Linked' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' },
            { value: 'disabled', label: 'Disabled' },
            { value: 'unlinked', label: 'Unlinked' },
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
            INR: '₹',
            AED: 'د.إ',
            // Add more as needed
        };

        const symbol = currencySymbols[currency] || currency;
        return `${symbol}${amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }
}
