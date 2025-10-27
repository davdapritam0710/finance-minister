import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
    UserService,
    User,
    UpdateProfileRequest,
    UpdatePreferencesRequest,
} from './services/user.service';

@Component({
    selector: 'app-user',
    standalone: false,
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
    user: User | null = null;
    loading = false;
    saving = false;

    // Profile form
    profileForm: FormGroup;

    // Preferences form
    preferencesForm: FormGroup;

    // Options for dropdowns
    currencyOptions = this.userService.getCurrencyOptions();
    dateFormatOptions = this.userService.getDateFormatOptions();
    numberFormatOptions = this.userService.getNumberFormatOptions();
    budgetPeriodOptions = this.userService.getBudgetPeriodOptions();
    riskToleranceOptions = this.userService.getRiskToleranceOptions();
    financialGoalCategories = this.userService.getFinancialGoalCategories();
    expenseCategoryColors = this.userService.getExpenseCategoryColors();

    // Financial goals management
    newGoal = {
        name: '',
        targetAmount: 0,
        targetDate: new Date(),
        currentAmount: 0,
        category: 'other',
    };

    // Expense categories management
    newCategory = {
        name: '',
        color: '#FF6B6B',
        icon: 'category',
    };

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef
    ) {
        this.profileForm = this.fb.group({
            firstName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                ],
            ],
            lastName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                ],
            ],
            phoneNumber: [''],
            address: this.fb.group({
                street: [''],
                city: [''],
                state: [''],
                zipCode: [''],
                country: [''],
            }),
        });

        this.preferencesForm = this.fb.group({
            theme: ['light'],
            notifications: this.fb.group({
                email: [true],
                push: [true],
            }),
            finance: this.fb.group({
                currency: ['USD'],
                dateFormat: ['MM/DD/YYYY'],
                numberFormat: ['US'],
                budgetAlerts: [true],
                defaultBudgetPeriod: ['monthly'],
                investmentRiskTolerance: ['moderate'],
                taxYear: [new Date().getFullYear().toString()],
            }),
        });
    }

    ngOnInit(): void {
        this.loadUserProfile();
    }

    // // Method to refresh profile data (can be called from other components)
    // refreshProfile(): void {
    //     this.loadUserProfile();
    // }

    // // Method to clear loading state if it gets stuck
    // clearLoadingState(): void {
    //     this.loading = false;
    //     this.cdr.detectChanges();
    // }

    // ngOnDestroy(): void {
    //     this.loading = false;
    // }

    loadUserProfile(): void {
        this.loading = true;

        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            if (this.loading) {
                console.warn('Profile loading timeout');
                this.loading = false;
                this.snackBar.open(
                    'Request timed out. Please try again.',
                    'Close',
                    {
                        duration: 3000,
                    }
                );
            }
        }, 10000); // 10 second timeout

        this.userService.getProfile().subscribe({
            next: (response) => {
                clearTimeout(timeout);
                this.user = response.user;
                this.populateForms();
                this.loading = false;
                // Use setTimeout to ensure change detection happens after form population
                setTimeout(() => {
                    this.cdr.detectChanges();
                }, 0);
            },
            error: (error) => {
                clearTimeout(timeout);
                console.error('Error loading profile:', error);
                this.snackBar.open('Failed to load profile', 'Close', {
                    duration: 3000,
                });
                this.loading = false;
                this.cdr.detectChanges();
            },
        });
    }

    populateForms(): void {
        if (this.user) {
            // Populate profile form
            this.profileForm.patchValue({
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                phoneNumber: this.user.phoneNumber || '',
                address: {
                    street: this.user.address?.street || '',
                    city: this.user.address?.city || '',
                    state: this.user.address?.state || '',
                    zipCode: this.user.address?.zipCode || '',
                    country: this.user.address?.country || '',
                },
            });

            // Populate preferences form
            if (this.user.preferences) {
                this.preferencesForm.patchValue({
                    theme: this.user.preferences.theme,
                    notifications: {
                        email: this.user.preferences.notifications.email,
                        push: this.user.preferences.notifications.push,
                    },
                    finance: {
                        currency: this.user.preferences.finance.currency,
                        dateFormat: this.user.preferences.finance.dateFormat,
                        numberFormat:
                            this.user.preferences.finance.numberFormat,
                        budgetAlerts:
                            this.user.preferences.finance.budgetAlerts,
                        defaultBudgetPeriod:
                            this.user.preferences.finance.defaultBudgetPeriod,
                        investmentRiskTolerance:
                            this.user.preferences.finance
                                .investmentRiskTolerance,
                        taxYear: this.user.preferences.finance.taxYear,
                    },
                });
            }
        }
    }

    saveProfile(): void {
        if (this.profileForm.valid) {
            this.saving = true;
            const profileData: UpdateProfileRequest = this.profileForm.value;

            this.userService.updateProfile(profileData).subscribe({
                next: (response) => {
                    this.snackBar.open(
                        'Profile updated successfully',
                        'Close',
                        { duration: 3000 }
                    );
                    this.loadUserProfile(); // Reload to get updated data
                    this.saving = false;
                },
                error: (error) => {
                    console.error('Error updating profile:', error);
                    this.snackBar.open('Failed to update profile', 'Close', {
                        duration: 3000,
                    });
                    this.saving = false;
                },
            });
        } else {
            this.snackBar.open('Please fill in all required fields', 'Close', {
                duration: 3000,
            });
        }
    }

    savePreferences(): void {
        if (this.preferencesForm.valid) {
            this.saving = true;
            const preferencesData: UpdatePreferencesRequest =
                this.preferencesForm.value;

            // Include financial goals and expense categories if they exist
            if (this.user?.preferences?.finance) {
                preferencesData.finance = {
                    ...preferencesData.finance,
                    expenseCategories:
                        this.user.preferences.finance.expenseCategories,
                    financialGoals:
                        this.user.preferences.finance.financialGoals,
                };
            }

            this.userService.updatePreferences(preferencesData).subscribe({
                next: (response) => {
                    this.snackBar.open(
                        'Preferences updated successfully',
                        'Close',
                        { duration: 3000 }
                    );
                    this.loadUserProfile(); // Reload to get updated data
                    this.saving = false;
                },
                error: (error) => {
                    console.error('Error updating preferences:', error);
                    this.snackBar.open(
                        'Failed to update preferences',
                        'Close',
                        { duration: 3000 }
                    );
                    this.saving = false;
                },
            });
        } else {
            this.snackBar.open('Please fill in all required fields', 'Close', {
                duration: 3000,
            });
        }
    }

    addFinancialGoal(): void {
        if (this.newGoal.name && this.newGoal.targetAmount > 0) {
            if (!this.user?.preferences?.finance?.financialGoals) {
                this.user!.preferences!.finance!.financialGoals = [];
            }

            this.user!.preferences!.finance!.financialGoals.push({
                name: this.newGoal.name,
                targetAmount: this.newGoal.targetAmount,
                targetDate: this.newGoal.targetDate,
                currentAmount: this.newGoal.currentAmount,
                category: this.newGoal.category as
                    | 'emergency'
                    | 'retirement'
                    | 'education'
                    | 'home'
                    | 'vacation'
                    | 'other',
            });

            // Reset form
            this.newGoal = {
                name: '',
                targetAmount: 0,
                targetDate: new Date(),
                currentAmount: 0,
                category: 'other',
            };
        }
    }

    removeFinancialGoal(index: number): void {
        if (this.user?.preferences?.finance?.financialGoals) {
            this.user.preferences.finance.financialGoals.splice(index, 1);
        }
    }

    addExpenseCategory(): void {
        if (this.newCategory.name) {
            if (!this.user?.preferences?.finance?.expenseCategories) {
                this.user!.preferences!.finance!.expenseCategories = [];
            }

            this.user!.preferences!.finance!.expenseCategories.push({
                name: this.newCategory.name,
                color: this.newCategory.color,
                icon: this.newCategory.icon,
            });

            // Reset form
            this.newCategory = {
                name: '',
                color: '#FF6B6B',
                icon: 'category',
            };
        }
    }

    removeExpenseCategory(index: number): void {
        if (this.user?.preferences?.finance?.expenseCategories) {
            this.user.preferences.finance.expenseCategories.splice(index, 1);
        }
    }

    getProgressPercentage(goal: any): number {
        if (goal.targetAmount === 0) return 0;
        return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    }
}
