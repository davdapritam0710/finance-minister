export interface PersonalInfo {
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'separated';
    nationality: string;
    occupation: string;
    employerName?: string;
    workExperience?: number;
}

export interface FinancialInfo {
    annualIncome: number;
    incomeSource:
        | 'salary'
        | 'business'
        | 'freelance'
        | 'investment'
        | 'pension'
        | 'other';
    monthlyExpenses?: number;
    assets?: number;
    liabilities?: number;
    netWorth?: number;
}

export interface InvestmentInfo {
    investmentExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    investmentGoals?: Array<
        | 'retirement'
        | 'education'
        | 'home_purchase'
        | 'wealth_building'
        | 'emergency_fund'
        | 'other'
    >;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentHorizon: 'short_term' | 'medium_term' | 'long_term';
    preferredInvestmentTypes?: Array<
        | 'stocks'
        | 'bonds'
        | 'mutual_funds'
        | 'etfs'
        | 'real_estate'
        | 'commodities'
        | 'crypto'
        | 'other'
    >;
}

export interface ComplianceInfo {
    pepStatus: 'yes' | 'no' | 'family_member';
    pepDetails?: string;
    sanctionsCheck?: boolean;
    taxResidency: string;
    fatcaStatus: 'us_citizen' | 'us_resident' | 'us_person' | 'non_us';
    crsStatus: 'reportable' | 'non_reportable';
}

export interface DocumentInfo {
    type: 'passport' | 'drivers_license' | 'national_id' | 'other';
    number: string;
    expiryDate?: Date;
    fileUrl?: string;
}

export interface Documents {
    identityDocument: DocumentInfo;
    addressDocument: {
        type: 'utility_bill' | 'bank_statement' | 'rental_agreement' | 'other';
        fileUrl?: string;
    };
    incomeDocument: {
        type:
            | 'salary_certificate'
            | 'tax_return'
            | 'bank_statement'
            | 'business_license'
            | 'other';
        fileUrl?: string;
    };
}

export interface KYC {
    _id: string;
    userId: string;
    personalInfo: PersonalInfo;
    financialInfo: FinancialInfo;
    investmentInfo: InvestmentInfo;
    complianceInfo: ComplianceInfo;
    documents: Documents;
    status:
        | 'pending'
        | 'under_review'
        | 'approved'
        | 'rejected'
        | 'requires_documents';
    rejectionReason?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface KYCStatus {
    isKycCompleted: boolean;
    status: string;
    completionPercentage: number;
    kyc?: KYC;
}

export interface KYCFormData {
    personalInfo: PersonalInfo;
    financialInfo: FinancialInfo;
    investmentInfo: InvestmentInfo;
    complianceInfo: ComplianceInfo;
    documents: Documents;
}

export interface KYCReviewData {
    status: 'approved' | 'rejected' | 'requires_documents';
    rejectionReason?: string;
    notes?: string;
}
