import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserDto } from '../models/index';
import { AuthService } from './auth.service';
import { ApiErrorService } from './api-error.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiBaseUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private apiError: ApiErrorService
  ) {}

  private getAuthHeaders(): { [header: string]: string } | undefined {
    const authToken = this.authService.getAuthToken();
    return authToken ? { 'X-Auth-Token': authToken } : undefined;
  }

  getProfile(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.apiError.parseAndThrow(error))
    );
  }

  uploadAvatar(file: File): Observable<UserDto> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<UserDto>(`${this.apiUrl}/me/avatar`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => this.apiError.parseAndThrow(error))
    );
  }

}
