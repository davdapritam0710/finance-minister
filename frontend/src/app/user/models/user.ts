export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    isKycCompleted: boolean;
    phoneNumber?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    preferences?: {
        theme: 'light' | 'dark';
        notifications: {
            email: boolean;
            push: boolean;
        };
        finance: {
            currency:
                | 'USD'
                | 'EUR'
                | 'GBP'
                | 'JPY'
                | 'CAD'
                | 'AUD'
                | 'CHF'
                | 'CNY'
                | 'INR';
            dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
            numberFormat: 'US' | 'EU' | 'IN';
            budgetAlerts: boolean;
            expenseCategories: Array<{
                name: string;
                color: string;
                icon: string;
            }>;
            defaultBudgetPeriod: 'weekly' | 'monthly' | 'yearly';
            investmentRiskTolerance: 'conservative' | 'moderate' | 'aggressive';
            taxYear: string;
            financialGoals: Array<{
                name: string;
                targetAmount: number;
                targetDate: Date;
                currentAmount: number;
                category:
                    | 'emergency'
                    | 'retirement'
                    | 'education'
                    | 'home'
                    | 'vacation'
                    | 'other';
            }>;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
}

export interface UpdatePreferencesRequest {
    theme?: 'light' | 'dark';
    notifications?: {
        email?: boolean;
        push?: boolean;
    };
    finance?: {
        currency?:
            | 'USD'
            | 'EUR'
            | 'GBP'
            | 'JPY'
            | 'CAD'
            | 'AUD'
            | 'CHF'
            | 'CNY'
            | 'INR';
        dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
        numberFormat?: 'US' | 'EU' | 'IN';
        budgetAlerts?: boolean;
        expenseCategories?: Array<{
            name: string;
            color: string;
            icon: string;
        }>;
        defaultBudgetPeriod?: 'weekly' | 'monthly' | 'yearly';
        investmentRiskTolerance?: 'conservative' | 'moderate' | 'aggressive';
        taxYear?: string;
        financialGoals?: Array<{
            name: string;
            targetAmount: number;
            targetDate: Date;
            currentAmount: number;
            category:
                | 'emergency'
                | 'retirement'
                | 'education'
                | 'home'
                | 'vacation'
                | 'other';
        }>;
    };
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}


