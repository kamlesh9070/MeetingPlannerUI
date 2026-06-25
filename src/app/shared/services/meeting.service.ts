import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MeetingRequest, MeetingResponse } from '../models/index';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private readonly apiUrl = `${environment.apiBaseUrl}/meetings`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createMeeting(request: MeetingRequest): Observable<MeetingResponse> {
    const authToken = this.authService.getAuthToken();
    return this.http.post<MeetingResponse>(this.apiUrl, request, {
      headers: { 'X-Auth-Token': authToken || '' }
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getMeeting(meetingId: string): Observable<MeetingResponse> {
    const authToken = this.authService.getAuthToken();
    return this.http.get<MeetingResponse>(`${this.apiUrl}/${meetingId}`, {
      headers: { 'X-Auth-Token': authToken || '' }
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || error.statusText || errorMessage;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
