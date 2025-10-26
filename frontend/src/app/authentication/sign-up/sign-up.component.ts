import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@src/app/authentication/services/auth.service';
import { RegisterRequest } from '@src/app/authentication/models/auth';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [
        RouterLink,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NgIf,
    ],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
    // isToggled
    isToggled = false;

    // Loading state
    isLoading = false;

    // Error message
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        this.authForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            phoneNumber: [
                '',
                [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)],
            ],
        });
    }

    // Password Hide
    hide = true;

    // Form
    authForm: FormGroup;

    onSubmit() {
        if (this.authForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            const registerData: RegisterRequest = {
                firstName: this.authForm.get('firstName')?.value,
                lastName: this.authForm.get('lastName')?.value,
                email: this.authForm.get('email')?.value,
                password: this.authForm.get('password')?.value,
                phoneNumber: this.authForm.get('phoneNumber')?.value,
            };

            this.authService.register(registerData).subscribe({
                next: (response) => {
                    console.log('Registration successful:', response);
                    this.isLoading = false;
                    // Redirect to dashboard since user is automatically logged in
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    console.error('Registration failed:', error);
                    this.isLoading = false;

                    // Handle different types of errors
                    if (error.status === 400) {
                        if (
                            error.error?.message ===
                            'User already exists with this email'
                        ) {
                            this.errorMessage =
                                'An account with this email already exists. Please sign in instead.';
                        } else {
                            this.errorMessage =
                                error.error?.message ||
                                'Registration failed. Please check your information.';
                        }
                    } else if (error.status === 0) {
                        this.errorMessage =
                            'Unable to connect to server. Please check your connection.';
                    } else if (error.error?.message) {
                        this.errorMessage = error.error.message;
                    } else {
                        this.errorMessage =
                            'Registration failed. Please try again.';
                    }
                },
            });
        } else {
            console.log('Form is invalid. Please check the fields.');
        }
    }
}
