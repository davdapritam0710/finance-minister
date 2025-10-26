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
import { LoginRequest } from '@src/app/authentication/models/auth';

@Component({
    selector: 'app-sign-in',
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
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
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
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
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

            const loginData: LoginRequest = {
                email: this.authForm.get('email')?.value,
                password: this.authForm.get('password')?.value,
            };

            this.authService.login(loginData).subscribe({
                next: (response) => {
                    console.log('Login successful:', response);
                    this.isLoading = false;
                    // Redirect to dashboard
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    console.error('Login failed:', error);
                    this.isLoading = false;

                    // Handle different types of errors
                    if (error.status === 401) {
                        this.errorMessage =
                            'Invalid email or password. Please try again.';
                    } else if (error.status === 0) {
                        this.errorMessage =
                            'Unable to connect to server. Please check your connection.';
                    } else if (error.error?.message) {
                        this.errorMessage = error.error.message;
                    } else {
                        this.errorMessage = 'Login failed. Please try again.';
                    }
                },
            });
        } else {
            console.log('Form is invalid. Please check the fields.');
        }
    }

    navigateTo(path: string) {
        console.log(path);
        this.router.navigate([path]);
    }
}
