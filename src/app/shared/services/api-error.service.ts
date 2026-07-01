import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export interface ParsedApiError {
  status: number;
  message: string;
  errorCode?: string;
  details?: Record<string, string> | string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiErrorService {
  parseAndThrow(error: HttpErrorResponse) {
    let parsed: ParsedApiError = {
      status: error.status || 0,
      message: error.message || 'Unknown error'
    };

    try {
      const body = error.error;
      if (body) {
        parsed.message = body.message || body.error || parsed.message;
        if (body.errorCode) parsed.errorCode = body.errorCode;
        if (body.details) parsed.details = body.details;
      }
    } catch (e) {
      // fall back to generic message
    }

    return throwError(() => parsed);
  }
}
