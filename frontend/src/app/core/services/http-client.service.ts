import { Injectable, NgZone } from '@angular/core';
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

    constructor(private http: HttpClient, private zone: NgZone) {}

    get<T>(
        endpoint: string,
        params?: Record<string, any>,
        headers?: HttpHeaders
    ): Observable<ApiResponse<T>> {
        const options = {
            params: new HttpParams({ fromObject: params || {} }),
            headers,
        };
        return this.wrapInZone(
            this.http.get<ApiResponse<T>>(
                `${this.baseUrl}/${endpoint}`,
                options
            )
        );
    }

    post<T>(
        endpoint: string,
        body: any,
        headers?: HttpHeaders
    ): Observable<ApiResponse<T>> {
        return this.wrapInZone(
            this.http.post<ApiResponse<T>>(
                `${this.baseUrl}/${endpoint}`,
                body,
                { headers }
            )
        );
    }

    put<T>(
        endpoint: string,
        body: any,
        headers?: HttpHeaders
    ): Observable<ApiResponse<T>> {
        return this.wrapInZone(
            this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body, {
                headers,
            })
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
        return this.wrapInZone(
            this.http.delete<ApiResponse<T>>(
                `${this.baseUrl}/${endpoint}`,
                options
            )
        );
    }

    patch<T>(
        endpoint: string,
        body: any,
        headers?: HttpHeaders
    ): Observable<ApiResponse<T>> {
        return this.wrapInZone(
            this.http.patch<ApiResponse<T>>(
                `${this.baseUrl}/${endpoint}`,
                body,
                { headers }
            )
        );
    }

    /**
     * 🔒 Centralized Zone Wrapper — guarantees UI updates after any HTTP call
     */
    private wrapInZone<T>(source$: Observable<T>): Observable<T> {
        return new Observable<T>((observer) => {
            const sub = source$.pipe(catchError(this.handleError)).subscribe({
                next: (value) => this.zone.run(() => observer.next(value)),
                error: (err) => this.zone.run(() => observer.error(err)),
                complete: () => this.zone.run(() => observer.complete()),
            });

            return () => sub.unsubscribe();
        });
    }

    private handleError(error: HttpErrorResponse) {
        console.error('HTTP Error Details:', error);
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client Error: ${error.error.message}`;
        } else {
            errorMessage = `Server Error [${error.status}]: ${error.message}`;
        }

        return throwError(() => new Error(errorMessage));
    }
}
