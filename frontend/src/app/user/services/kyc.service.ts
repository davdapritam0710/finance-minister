import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClientService } from '@src/app/core/services/http-client.service';
import {
    PersonalInfo,
    FinancialInfo,
    InvestmentInfo,
    ComplianceInfo,
    DocumentInfo,
    Documents,
    KYC,
    KYCStatus,
    KYCFormData,
    KYCReviewData,
} from '../models/kyc';

@Injectable({
    providedIn: 'root',
})
export class KYCService {
    constructor(private httpClient: HttpClientService) {}

    /**
     * Create or update KYC form
     */
    createOrUpdateKYC(kycData: KYCFormData): Observable<{ kyc: KYC }> {
        return this.httpClient.post<{ kyc: KYC }>('api/kyc', kycData).pipe(
            map((response) => ({
                kyc: response.data?.kyc || (response as any).kyc,
            }))
        );
    }

    /**
     * Get user's KYC form
     */
    getKYC(): Observable<{ kyc: KYC }> {
        return this.httpClient.get<{ kyc: KYC }>('api/kyc').pipe(
            map((response) => ({
                kyc: response.data?.kyc || (response as any).kyc,
            }))
        );
    }

    /**
     * Get KYC status
     */
    getKYCStatus(): Observable<KYCStatus> {
        return this.httpClient
            .get<KYCStatus>('api/kyc/status')
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Submit KYC for review
     */
    submitKYC(): Observable<{ kyc: KYC }> {
        return this.httpClient.post<{ kyc: KYC }>('api/kyc/submit', {}).pipe(
            map((response) => ({
                kyc: response.data?.kyc || (response as any).kyc,
            }))
        );
    }

    /**
     * Get all KYC forms (Admin only)
     */
    getAllKYC(
        page: number = 1,
        limit: number = 10,
        status?: string
    ): Observable<{
        kycForms: KYC[];
        pagination: {
            current: number;
            pages: number;
            total: number;
        };
    }> {
        const params: any = { page, limit };
        if (status) params.status = status;

        return this.httpClient
            .get<{
                kycForms: KYC[];
                pagination: {
                    current: number;
                    pages: number;
                    total: number;
                };
            }>('api/kyc/admin', params)
            .pipe(map((response) => response.data || (response as any)));
    }

    /**
     * Review KYC form (Admin only)
     */
    reviewKYC(
        kycId: string,
        reviewData: KYCReviewData
    ): Observable<{ kyc: KYC }> {
        return this.httpClient
            .put<{ kyc: KYC }>(`api/kyc/admin/${kycId}/review`, reviewData)
            .pipe(
                map((response) => ({
                    kyc: response.data?.kyc || (response as any).kyc,
                }))
            );
    }

    /**
     * Get KYC form by ID (Admin only)
     */
    getKYCById(kycId: string): Observable<{ kyc: KYC }> {
        return this.httpClient.get<{ kyc: KYC }>(`api/kyc/admin/${kycId}`).pipe(
            map((response) => ({
                kyc: response.data?.kyc || (response as any).kyc,
            }))
        );
    }

    /**
     * Get gender options
     */
    getGenderOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' },
        ];
    }

    /**
     * Get marital status options
     */
    getMaritalStatusOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'single', label: 'Single' },
            { value: 'married', label: 'Married' },
            { value: 'divorced', label: 'Divorced' },
            { value: 'widowed', label: 'Widowed' },
            { value: 'separated', label: 'Separated' },
        ];
    }

    /**
     * Get income source options
     */
    getIncomeSourceOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'salary', label: 'Salary' },
            { value: 'business', label: 'Business' },
            { value: 'freelance', label: 'Freelance' },
            { value: 'investment', label: 'Investment' },
            { value: 'pension', label: 'Pension' },
            { value: 'other', label: 'Other' },
        ];
    }

    /**
     * Get investment experience options
     */
    getInvestmentExperienceOptions(): Array<{
        value: string;
        label: string;
        description: string;
    }> {
        return [
            {
                value: 'beginner',
                label: 'Beginner',
                description: 'No prior investment experience',
            },
            {
                value: 'intermediate',
                label: 'Intermediate',
                description: 'Some investment experience',
            },
            {
                value: 'advanced',
                label: 'Advanced',
                description: 'Experienced investor',
            },
            {
                value: 'expert',
                label: 'Expert',
                description: 'Professional investment experience',
            },
        ];
    }

    /**
     * Get investment goals options
     */
    getInvestmentGoalsOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'retirement', label: 'Retirement Planning' },
            { value: 'education', label: 'Education Fund' },
            { value: 'home_purchase', label: 'Home Purchase' },
            { value: 'wealth_building', label: 'Wealth Building' },
            { value: 'emergency_fund', label: 'Emergency Fund' },
            { value: 'other', label: 'Other' },
        ];
    }

    /**
     * Get investment horizon options
     */
    getInvestmentHorizonOptions(): Array<{
        value: string;
        label: string;
        description: string;
    }> {
        return [
            {
                value: 'short_term',
                label: 'Short Term',
                description: 'Less than 1 year',
            },
            {
                value: 'medium_term',
                label: 'Medium Term',
                description: '1-5 years',
            },
            {
                value: 'long_term',
                label: 'Long Term',
                description: 'More than 5 years',
            },
        ];
    }

    /**
     * Get investment types options
     */
    getInvestmentTypesOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'stocks', label: 'Stocks' },
            { value: 'bonds', label: 'Bonds' },
            { value: 'mutual_funds', label: 'Mutual Funds' },
            { value: 'etfs', label: 'ETFs' },
            { value: 'real_estate', label: 'Real Estate' },
            { value: 'commodities', label: 'Commodities' },
            { value: 'crypto', label: 'Cryptocurrency' },
            { value: 'other', label: 'Other' },
        ];
    }

    /**
     * Get PEP status options
     */
    getPEPStatusOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
            { value: 'family_member', label: 'Family Member' },
        ];
    }

    /**
     * Get FATCA status options
     */
    getFATCAStatusOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'non_us', label: 'Non-US Person' },
            { value: 'us_citizen', label: 'US Citizen' },
            { value: 'us_resident', label: 'US Resident' },
            { value: 'us_person', label: 'US Person' },
        ];
    }

    /**
     * Get CRS status options
     */
    getCRSStatusOptions(): Array<{ value: string; label: string }> {
        return [
            { value: 'non_reportable', label: 'Non-Reportable' },
            { value: 'reportable', label: 'Reportable' },
        ];
    }

    /**
     * Get identity document types
     */
    getIdentityDocumentTypes(): Array<{ value: string; label: string }> {
        return [
            { value: 'passport', label: 'Passport' },
            { value: 'drivers_license', label: "Driver's License" },
            { value: 'national_id', label: 'National ID' },
            { value: 'other', label: 'Other' },
        ];
    }

    /**
     * Get address document types
     */
    getAddressDocumentTypes(): Array<{ value: string; label: string }> {
        return [
            { value: 'utility_bill', label: 'Utility Bill' },
            { value: 'bank_statement', label: 'Bank Statement' },
            { value: 'rental_agreement', label: 'Rental Agreement' },
            { value: 'other', label: 'Other' },
        ];
    }

    /**
     * Get income document types
     */
    getIncomeDocumentTypes(): Array<{ value: string; label: string }> {
        return [
            { value: 'salary_certificate', label: 'Salary Certificate' },
            { value: 'tax_return', label: 'Tax Return' },
            { value: 'bank_statement', label: 'Bank Statement' },
            { value: 'business_license', label: 'Business License' },
            { value: 'other', label: 'Other' },
        ];
    }
}
