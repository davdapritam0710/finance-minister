import { Injectable } from '@angular/core';
import { HttpClientService } from '@src/app/core/services/http-client.service';
import { map, Observable } from 'rxjs';
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
        return this.http
            .post<LoginResponse>('/api/users/login', data)
            .pipe(map((res) => res.data as LoginResponse));
    }

    register(data: RegisterRequest): Observable<any> {
        return this.http.post<any>('/api/users/register', data);
    }
}
