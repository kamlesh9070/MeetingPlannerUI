import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MeetingRequest, MeetingResponse } from '../models/index';
import { AuthService } from './auth.service';
import { toApiDateTime } from '../utils/datetime.util';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private readonly apiUrl = `${environment.apiBaseUrl}/meetings`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): { [header: string]: string } | undefined {
    const authToken = this.authService.getAuthToken();
    return authToken ? { 'X-Auth-Token': authToken } : undefined;
  }

  createMeeting(request: MeetingRequest): Observable<MeetingResponse> {
    const payload: MeetingRequest = {
      ...request,
      startTime: toApiDateTime(request.startTime),
      endTime: toApiDateTime(request.endTime)
    };
    return this.http.post<MeetingResponse>(this.apiUrl, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  listMeetings(): Observable<MeetingResponse[]> {
    return this.http.get<MeetingResponse[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getMeeting(meetingId: string): Observable<MeetingResponse> {
    return this.http.get<MeetingResponse>(`${this.apiUrl}/${meetingId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP error', error);
    const status = error.status;
    let serverMsg = error.error?.error || error.error?.message || error.error || error.statusText;
    if (typeof serverMsg === 'object') {
      serverMsg = JSON.stringify(serverMsg);
    }
    const errorMessage = `HTTP ${status} - ${serverMsg}`;
    return throwError(() => new Error(errorMessage));
  }
}
