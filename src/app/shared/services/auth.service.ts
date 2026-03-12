import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_URL = `${environment.apiUrl}/api/auth`;
  private readonly V1_URL = `${environment.apiUrl}/api/v1`;
  private readonly TOKEN_KEY = 'dev_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  protected readonly isAuthenticated = signal(false);

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.isAuthenticated.set(true);
      this.me().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_URL}/register`, data)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
          this.isAuthenticated.set(true);
        })
      );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_URL}/login`, data)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
          this.isAuthenticated.set(true);
        })
      );
  }

  me(): Observable<User> {
    return this.http.get<any>(`${this.V1_URL}/auth/me`).pipe(
      map(res => (res?.user ?? res?.data ?? res) as User)
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}