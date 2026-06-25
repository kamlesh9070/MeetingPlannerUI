import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, SignupRequest, UserDto } from '../models/index';

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
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', user.authToken);
    this.currentUserSubject.next(user);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private handleUserResponse(user: UserDto): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', user.authToken);
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): UserDto | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
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
