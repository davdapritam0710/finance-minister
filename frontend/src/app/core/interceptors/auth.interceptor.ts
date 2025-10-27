import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private getToken(): string | null {
        return localStorage.getItem('access-token');
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.getToken();

        if (token) {
            console.log('AuthInterceptor: Adding token to request:', req.url);
            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return next.handle(cloned);
        } else {
            console.log(
                'AuthInterceptor: No token found for request:',
                req.url
            );
        }

        return next.handle(req);
    }
}
