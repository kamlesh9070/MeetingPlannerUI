import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getAuthToken();

    // Only attach the auth token for API calls. Avoid adding custom headers
    // to requests for static assets (e.g. /uploads/) which can trigger
    // CORS preflight or be rejected by the server.
    const isApiRequest = request.url.includes('/api/');

    if (isApiRequest) {
      if (authToken && !request.headers.has('X-Auth-Token')) {
        request = request.clone({
          setHeaders: {
            'X-Auth-Token': authToken
          }
        });
      } else if (!authToken) {
        console.warn('No auth token available for API request:', request.url);
      }
    }

    return next.handle(request);
  }
}
