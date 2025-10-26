import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@src/environments/environment';

interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message?: string;
    data?: T;
    errors?: any;
}

@Injectable({
    providedIn: 'root',
})
export class HttpClientService {
    private readonly baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    get<T>(
        endpoint: string,
        params?: Record<string, any>,
        headers?: HttpHeaders
    ): Observable<ApiResponse<T>> {
        const options = {
            params: new HttpParams({ fromObject: params || {} }),
            headers,
        };
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
            map((res) => res as ApiResponse<T>),
            catchError(this.handleError)
        );
    }

    post<T>(
        endpoint: string,
        body: any,
        headers?: HttpHeaders
    ): Observable<ApiResponse<T>> {
        return this.http
            .post<T>(`${this.baseUrl}/${endpoint}`, body, { headers })
            .pipe(
                map((res) => res as ApiResponse<T>),
                catchError(this.handleError)
            );
    }

    put<T>(
        endpoint: string,
        body: any,
        headers?: HttpHeaders
    ): Observable<ApiResponse<T>> {
        return this.http
            .put<T>(`${this.baseUrl}/${endpoint}`, body, { headers })
            .pipe(
                map((res) => res as ApiResponse<T>),
                catchError(this.handleError)
            );
    }

    delete<T>(
        endpoint: string,
        params?: Record<string, any>,
        headers?: HttpHeaders
    ): Observable<ApiResponse<T>> {
        const options = {
            params: new HttpParams({ fromObject: params || {} }),
            headers,
        };
        return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
            map((res) => res as ApiResponse<T>),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client Error: ${error.error.message}`;
        } else {
            errorMessage = `Server Error [${error.status}]: ${error.message}`;
        }

        console.error('HTTP Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
