import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClientService } from '@src/app/core/services/http-client.service';
import {
    User,
    UpdateProfileRequest,
    UpdatePreferencesRequest,
    ChangePasswordRequest,
} from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private httpClient: HttpClientService) {}

    /**
     * Get current user profile
     */
    getProfile(): Observable<{ user: User }> {
        return this.httpClient.get<{ user: User }>('api/users/profile').pipe(
            map((response) => ({
                user: response.data?.user || (response as any).user,
            }))
        );
    }

    /**
     * Update user profile
     */
    updateProfile(profileData: UpdateProfileRequest): Observable<any> {
        return this.httpClient.put<any>('api/users/profile', profileData);
    }

    /**
     * Update user preferences
     */
    updatePreferences(
        preferencesData: UpdatePreferencesRequest
    ): Observable<any> {
        return this.httpClient.put<any>('api/users/profile', preferencesData);
    }

    /**
     * Change user password
     */
    changePassword(passwordData: ChangePasswordRequest): Observable<any> {
        return this.httpClient.put<any>(
            'api/users/change-password',
            passwordData
        );
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
        ];
    }

    /**
     * Get date format options
     */
    getDateFormatOptions(): Array<{
        value: string;
        label: string;
        example: string;
    }> {
        return [
            { value: 'MM/DD/YYYY', label: 'US Format', example: '12/31/2023' },
            {
                value: 'DD/MM/YYYY',
                label: 'European Format',
                example: '31/12/2023',
            },
            { value: 'YYYY-MM-DD', label: 'ISO Format', example: '2023-12-31' },
        ];
    }

    /**
     * Get number format options
     */
    getNumberFormatOptions(): Array<{
        value: string;
        label: string;
        example: string;
    }> {
        return [
            { value: 'US', label: 'US Format', example: '1,234.56' },
            { value: 'EU', label: 'European Format', example: '1.234,56' },
            { value: 'IN', label: 'Indian Format', example: '1,23,456.78' },
        ];
    }

    /**
     * Get budget period options
     */
    getBudgetPeriodOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
        ];
    }

    /**
     * Get risk tolerance options
     */
    getRiskToleranceOptions(): Array<{
        value: string;
        label: string;
        description: string;
    }> {
        return [
            {
                value: 'conservative',
                label: 'Conservative',
                description: 'Low risk, stable returns',
            },
            {
                value: 'moderate',
                label: 'Moderate',
                description: 'Balanced risk and return',
            },
            {
                value: 'aggressive',
                label: 'Aggressive',
                description: 'High risk, high potential returns',
            },
        ];
    }

    /**
     * Get financial goal categories
     */
    getFinancialGoalCategories(): Array<{
        value: string;
        label: string;
        icon: string;
    }> {
        return [
            { value: 'emergency', label: 'Emergency Fund', icon: 'emergency' },
            { value: 'retirement', label: 'Retirement', icon: 'retirement' },
            { value: 'education', label: 'Education', icon: 'education' },
            { value: 'home', label: 'Home Purchase', icon: 'home' },
            { value: 'vacation', label: 'Vacation', icon: 'vacation' },
            { value: 'other', label: 'Other', icon: 'other' },
        ];
    }

    /**
     * Get expense category colors
     */
    getExpenseCategoryColors(): Array<{ value: string; label: string }> {
        return [
            { value: '#FF6B6B', label: 'Red' },
            { value: '#4ECDC4', label: 'Teal' },
            { value: '#45B7D1', label: 'Blue' },
            { value: '#96CEB4', label: 'Green' },
            { value: '#FFEAA7', label: 'Yellow' },
            { value: '#DDA0DD', label: 'Purple' },
            { value: '#FFB347', label: 'Orange' },
            { value: '#98D8C8', label: 'Mint' },
        ];
    }
}
