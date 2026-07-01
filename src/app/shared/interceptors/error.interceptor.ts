import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiErrorService } from '../services/api-error.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private apiError: ApiErrorService, private toast: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        try {
          const parsed = this.apiError.parse(err);
          if (parsed && parsed.message) {
            this.toast.show(parsed.message, parsed.status >= 400 && parsed.status < 500 ? 'error' : 'warn');
          }
          return throwError(() => parsed);
        } catch (e) {
          this.toast.show('An unexpected error occurred', 'error');
          return throwError(() => e);
        }
      })
    );
  }
}
