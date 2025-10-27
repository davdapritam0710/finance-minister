import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink, Router } from '@angular/router';

import {
    KYCService,
    KYC,
    KYCFormData,
    PersonalInfo,
    FinancialInfo,
    InvestmentInfo,
    ComplianceInfo,
    Documents,
} from '../services/kyc.service';

@Component({
    selector: 'app-kyc-form',
    standalone: false,
    templateUrl: './kyc-form.component.html',
    styleUrls: ['./kyc-form.component.scss'],
})
export class KYCFormComponent implements OnInit {
    loading = false;
    saving = false;
    submitting = false;
    kyc: KYC | null = null;
    completionPercentage = 0;

    // Stepper configuration
    isLinear = true;
    currentStep = 0;

    // Form groups for each step
    personalInfoForm: FormGroup;
    financialInfoForm: FormGroup;
    investmentInfoForm: FormGroup;
    complianceInfoForm: FormGroup;
    documentsForm: FormGroup;

    // Options for dropdowns
    genderOptions: Array<{ value: string; label: string }> = [];
    maritalStatusOptions: Array<{ value: string; label: string }> = [];
    incomeSourceOptions: Array<{ value: string; label: string }> = [];
    investmentExperienceOptions: Array<{
        value: string;
        label: string;
        description: string;
    }> = [];
    investmentGoalsOptions: Array<{ value: string; label: string }> = [];
    investmentHorizonOptions: Array<{
        value: string;
        label: string;
        description: string;
    }> = [];
    investmentTypesOptions: Array<{ value: string; label: string }> = [];
    pepStatusOptions: Array<{ value: string; label: string }> = [];
    fatcaStatusOptions: Array<{ value: string; label: string }> = [];
    crsStatusOptions: Array<{ value: string; label: string }> = [];
    identityDocumentTypes: Array<{ value: string; label: string }> = [];
    addressDocumentTypes: Array<{ value: string; label: string }> = [];
    incomeDocumentTypes: Array<{ value: string; label: string }> = [];

    constructor(
        private kycService: KYCService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.initializeForms();
        this.initializeOptions();
    }

    ngOnInit(): void {
        this.loadKYCData();
    }

    goBackToProfile(): void {
        console.log('Navigating back to profile...');
        this.router.navigate(['/user/profile']);
    }

    initializeOptions(): void {
        this.genderOptions = this.kycService.getGenderOptions();
        this.maritalStatusOptions = this.kycService.getMaritalStatusOptions();
        this.incomeSourceOptions = this.kycService.getIncomeSourceOptions();
        this.investmentExperienceOptions =
            this.kycService.getInvestmentExperienceOptions();
        this.investmentGoalsOptions =
            this.kycService.getInvestmentGoalsOptions();
        this.investmentHorizonOptions =
            this.kycService.getInvestmentHorizonOptions();
        this.investmentTypesOptions =
            this.kycService.getInvestmentTypesOptions();
        this.pepStatusOptions = this.kycService.getPEPStatusOptions();
        this.fatcaStatusOptions = this.kycService.getFATCAStatusOptions();
        this.crsStatusOptions = this.kycService.getCRSStatusOptions();
        this.identityDocumentTypes = this.kycService.getIdentityDocumentTypes();
        this.addressDocumentTypes = this.kycService.getAddressDocumentTypes();
        this.incomeDocumentTypes = this.kycService.getIncomeDocumentTypes();
    }

    initializeForms(): void {
        // Personal Information Form
        this.personalInfoForm = this.fb.group({
            dateOfBirth: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            maritalStatus: ['', [Validators.required]],
            nationality: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                ],
            ],
            occupation: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ],
            ],
            employerName: ['', [Validators.maxLength(100)]],
            workExperience: [0, [Validators.min(0), Validators.max(50)]],
        });

        // Financial Information Form
        this.financialInfoForm = this.fb.group({
            annualIncome: [0, [Validators.required, Validators.min(0)]],
            incomeSource: ['', [Validators.required]],
            monthlyExpenses: [0, [Validators.min(0)]],
            assets: [0, [Validators.min(0)]],
            liabilities: [0, [Validators.min(0)]],
        });

        // Investment Information Form
        this.investmentInfoForm = this.fb.group({
            investmentExperience: ['', [Validators.required]],
            investmentGoals: [[]],
            riskTolerance: ['', [Validators.required]],
            investmentHorizon: ['', [Validators.required]],
            preferredInvestmentTypes: [[]],
        });

        // Compliance Information Form
        this.complianceInfoForm = this.fb.group({
            pepStatus: ['', [Validators.required]],
            pepDetails: ['', [Validators.maxLength(500)]],
            sanctionsCheck: [false],
            taxResidency: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                ],
            ],
            fatcaStatus: ['', [Validators.required]],
            crsStatus: ['', [Validators.required]],
        });

        // Documents Form - Using flat structure to match HTML template
        this.documentsForm = this.fb.group({
            'documents.identityDocument.type': ['', [Validators.required]],
            'documents.identityDocument.number': [
                '',
                [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(50),
                ],
            ],
            'documents.identityDocument.expiryDate': [''],
            'documents.identityDocument.fileUrl': [''],
            'documents.addressDocument.type': ['', [Validators.required]],
            'documents.addressDocument.fileUrl': [''],
            'documents.incomeDocument.type': ['', [Validators.required]],
            'documents.incomeDocument.fileUrl': [''],
        });
    }

    loadKYCData(): void {
        this.loading = true;
        this.kycService.getKYCStatus().subscribe({
            next: (response) => {
                this.kyc = response.kyc || null;
                this.completionPercentage = response.completionPercentage || 0;

                if (this.kyc) {
                    this.populateForms();
                }
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading KYC data:', error);
                this.snackBar.open('Failed to load KYC data', 'Close', {
                    duration: 3000,
                });
                this.loading = false;
            },
        });
    }

    populateForms(): void {
        if (this.kyc) {
            // Personal Information
            this.personalInfoForm.patchValue({
                dateOfBirth: this.kyc.personalInfo.dateOfBirth,
                gender: this.kyc.personalInfo.gender,
                maritalStatus: this.kyc.personalInfo.maritalStatus,
                nationality: this.kyc.personalInfo.nationality,
                occupation: this.kyc.personalInfo.occupation,
                employerName: this.kyc.personalInfo.employerName || '',
                workExperience: this.kyc.personalInfo.workExperience || 0,
            });

            // Financial Information
            this.financialInfoForm.patchValue({
                annualIncome: this.kyc.financialInfo.annualIncome,
                incomeSource: this.kyc.financialInfo.incomeSource,
                monthlyExpenses: this.kyc.financialInfo.monthlyExpenses || 0,
                assets: this.kyc.financialInfo.assets || 0,
                liabilities: this.kyc.financialInfo.liabilities || 0,
            });

            // Investment Information
            this.investmentInfoForm.patchValue({
                investmentExperience:
                    this.kyc.investmentInfo.investmentExperience,
                investmentGoals: this.kyc.investmentInfo.investmentGoals || [],
                riskTolerance: this.kyc.investmentInfo.riskTolerance,
                investmentHorizon: this.kyc.investmentInfo.investmentHorizon,
                preferredInvestmentTypes:
                    this.kyc.investmentInfo.preferredInvestmentTypes || [],
            });

            // Compliance Information
            this.complianceInfoForm.patchValue({
                pepStatus: this.kyc.complianceInfo.pepStatus,
                pepDetails: this.kyc.complianceInfo.pepDetails || '',
                sanctionsCheck: this.kyc.complianceInfo.sanctionsCheck || false,
                taxResidency: this.kyc.complianceInfo.taxResidency,
                fatcaStatus: this.kyc.complianceInfo.fatcaStatus,
                crsStatus: this.kyc.complianceInfo.crsStatus,
            });

            // Documents - Using flat structure
            this.documentsForm.patchValue({
                'documents.identityDocument.type':
                    this.kyc.documents.identityDocument.type,
                'documents.identityDocument.number':
                    this.kyc.documents.identityDocument.number,
                'documents.identityDocument.expiryDate':
                    this.kyc.documents.identityDocument.expiryDate || '',
                'documents.identityDocument.fileUrl':
                    this.kyc.documents.identityDocument.fileUrl || '',
                'documents.addressDocument.type':
                    this.kyc.documents.addressDocument.type,
                'documents.addressDocument.fileUrl':
                    this.kyc.documents.addressDocument.fileUrl || '',
                'documents.incomeDocument.type':
                    this.kyc.documents.incomeDocument.type,
                'documents.incomeDocument.fileUrl':
                    this.kyc.documents.incomeDocument.fileUrl || '',
            });
        }
    }

    saveKYC(): void {
        if (this.isFormValid()) {
            this.saving = true;
            const kycData: KYCFormData = this.getFormData();

            this.kycService.createOrUpdateKYC(kycData).subscribe({
                next: (response) => {
                    this.kyc = response.kyc;
                    this.snackBar.open('KYC form saved successfully', 'Close', {
                        duration: 3000,
                    });
                    this.loadKYCData(); // Reload to get updated completion percentage
                    this.saving = false;
                },
                error: (error) => {
                    console.error('Error saving KYC:', error);
                    this.snackBar.open('Failed to save KYC form', 'Close', {
                        duration: 3000,
                    });
                    this.saving = false;
                },
            });
        } else {
            this.snackBar.open('Please complete all required fields', 'Close', {
                duration: 3000,
            });
        }
    }

    submitKYC(): void {
        if (this.isFormValid()) {
            this.submitting = true;

            // First save the form
            const kycData: KYCFormData = this.getFormData();

            this.kycService.createOrUpdateKYC(kycData).subscribe({
                next: () => {
                    // Then submit for review
                    this.kycService.submitKYC().subscribe({
                        next: (response) => {
                            this.kyc = response.kyc;
                            this.snackBar.open(
                                'KYC form submitted for review successfully',
                                'Close',
                                { duration: 3000 }
                            );
                            this.submitting = false;
                        },
                        error: (error) => {
                            console.error('Error submitting KYC:', error);
                            this.snackBar.open(
                                'Failed to submit KYC form',
                                'Close',
                                { duration: 3000 }
                            );
                            this.submitting = false;
                        },
                    });
                },
                error: (error) => {
                    console.error('Error saving KYC before submission:', error);
                    this.snackBar.open('Failed to save KYC form', 'Close', {
                        duration: 3000,
                    });
                    this.submitting = false;
                },
            });
        } else {
            this.snackBar.open(
                'Please complete all required fields before submitting',
                'Close',
                { duration: 3000 }
            );
        }
    }

    isFormValid(): boolean {
        return (
            this.personalInfoForm.valid &&
            this.financialInfoForm.valid &&
            this.investmentInfoForm.valid &&
            this.complianceInfoForm.valid &&
            this.documentsForm.valid
        );
    }

    private getFormData(): KYCFormData {
        const personalInfo: PersonalInfo = this.personalInfoForm.value;
        const financialInfo: FinancialInfo = this.financialInfoForm.value;
        const investmentInfo: InvestmentInfo = this.investmentInfoForm.value;
        const complianceInfo: ComplianceInfo = this.complianceInfoForm.value;

        // Convert flat documents form to nested structure
        const documentsFormValue = this.documentsForm.value;
        const documents: Documents = {
            identityDocument: {
                type: documentsFormValue['documents.identityDocument.type'],
                number: documentsFormValue['documents.identityDocument.number'],
                expiryDate:
                    documentsFormValue['documents.identityDocument.expiryDate'],
                fileUrl:
                    documentsFormValue['documents.identityDocument.fileUrl'],
            },
            addressDocument: {
                type: documentsFormValue['documents.addressDocument.type'],
                fileUrl:
                    documentsFormValue['documents.addressDocument.fileUrl'],
            },
            incomeDocument: {
                type: documentsFormValue['documents.incomeDocument.type'],
                fileUrl: documentsFormValue['documents.incomeDocument.fileUrl'],
            },
        };

        return {
            personalInfo,
            financialInfo,
            investmentInfo,
            complianceInfo,
            documents,
        };
    }

    onStepChange(event: any): void {
        this.currentStep = event.selectedIndex;
    }

    canProceedToNextStep(): boolean {
        switch (this.currentStep) {
            case 0:
                return this.personalInfoForm.valid;
            case 1:
                return this.financialInfoForm.valid;
            case 2:
                return this.investmentInfoForm.valid;
            case 3:
                return this.complianceInfoForm.valid;
            case 4:
                return this.documentsForm.valid;
            default:
                return false;
        }
    }

    getStepTitle(stepIndex: number): string {
        const titles = [
            'Personal Information',
            'Financial Information',
            'Investment Information',
            'Compliance Information',
            'Document Upload',
        ];
        return titles[stepIndex] || '';
    }

    getStatusColor(): string {
        if (!this.kyc) return 'primary';

        switch (this.kyc.status) {
            case 'approved':
                return 'accent';
            case 'rejected':
                return 'warn';
            case 'under_review':
                return 'primary';
            case 'requires_documents':
                return 'warn';
            default:
                return 'primary';
        }
    }

    getStatusText(): string {
        if (!this.kyc) return 'Not Started';

        switch (this.kyc.status) {
            case 'pending':
                return 'Draft';
            case 'under_review':
                return 'Under Review';
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            case 'requires_documents':
                return 'Requires Documents';
            default:
                return 'Unknown';
        }
    }
}
