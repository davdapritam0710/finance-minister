import { Injectable } from '@angular/core';
import { HttpClientService } from '@src/app/core/services/http-client.service';
import { map, Observable, tap } from 'rxjs';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
} from '@src/app/authentication/models/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClientService) {}

    login(data: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>('api/users/login', data).pipe(
            map((res) => res.data as LoginResponse),
            tap((response) => {
                // Store token in localStorage
                localStorage.setItem('access-token', response.token);
            })
        );
    }

    register(data: RegisterRequest): Observable<any> {
        return this.http.post<any>('api/users/register', data);
    }

    // Helper method to get token from localStorage
    getToken(): string | null {
        return localStorage.getItem('access-token');
    }

    // Helper method to remove token from localStorage
    logout(): void {
        localStorage.removeItem('access-token');
    }

    // Helper method to check if user is logged in
    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
