import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserDto } from '../models/index';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiBaseUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProfile(): Observable<UserDto> {
    const authToken = this.authService.getAuthToken();
    return this.http.get<UserDto>(`${this.apiUrl}/me`, {
      headers: { 'X-Auth-Token': authToken || '' }
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  uploadAvatar(file: File): Observable<UserDto> {
    const authToken = this.authService.getAuthToken();
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<UserDto>(`${this.apiUrl}/me/avatar`, formData, {
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
