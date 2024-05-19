import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem("TOKEN_KEY");
        if (token !== null) {
            const modifiedRequest = request.clone({
                setHeaders: {
                    'x-access-token': token,
                }
            });
            return next.handle(modifiedRequest);
        } else {
            return next.handle(request);
        }
    }
}