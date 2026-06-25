import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, SignupRequest, UserDto } from '../models/index';
import { resolveAssetUrl } from '../utils/url.util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<UserDto | null>(this.loadUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  signup(request: SignupRequest): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/signup`, request).pipe(
      tap(user => this.handleUserResponse(user)),
      catchError(error => this.handleError(error))
    );
  }

  login(request: LoginRequest): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/login`, request).pipe(
      tap(user => this.handleUserResponse(user)),
      catchError(error => this.handleError(error))
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  updateUser(user: UserDto): void {
    const normalized = this.normalizeUser(user);
    localStorage.setItem('currentUser', JSON.stringify(normalized));
    localStorage.setItem('authToken', normalized.authToken);
    this.currentUserSubject.next(normalized);
  }

  getAuthToken(): string | null {
    const token = localStorage.getItem('authToken');
    return token && token !== 'null' && token !== 'undefined' ? token : null;
  }

  private handleUserResponse(user: UserDto): void {
    const normalized = this.normalizeUser(user);
    localStorage.setItem('currentUser', JSON.stringify(normalized));
    localStorage.setItem('authToken', normalized.authToken);
    this.currentUserSubject.next(normalized);
  }

  private loadUserFromStorage(): UserDto | null {
    const user = localStorage.getItem('currentUser');
    return user ? this.normalizeUser(JSON.parse(user)) : null;
  }

  private normalizeUser(user: UserDto): UserDto {
    return {
      ...user,
      avatarUrl: resolveAssetUrl(user.avatarUrl) ?? undefined
    };
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
