// Angular imports
import { Injectable } from '@angular/core';
import { Observable, of, delay, tap, throwError } from 'rxjs';

// Internal imports
import { AuthToken, LoginCredentials } from '../../core/models/auth.model';
import { UserRole, User } from '../../core/models/employee.model';

//Mock users data
import mockUsersJson from '../../shared/mockData/mock-users.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_token';
  private readonly MOCK_USERS: User[] = (mockUsersJson as unknown) as User[];

  private _authToken: AuthToken | null = null;

  constructor() {
    this.loadTokenFromStorage();
  }

  get authToken(): AuthToken | null {
    return this._authToken;
  }

  login(credentials: LoginCredentials): Observable<AuthToken> {
    const user = this.MOCK_USERS.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      return throwError(() => new Error('Invalid credentials'));
    }

    const token: AuthToken = {
      token: this.generateToken(),
      role: user.role,
      username: user.username,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };

    return of(token).pipe(
      delay(500), // Simulate API call
      tap(tokenData => {
        this.setToken(tokenData);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this._authToken = null;
  }

  isAuthenticated(): boolean {
    if (!this._authToken) {
      return false;
    }
    return Date.now() < this._authToken.expiresAt;
  }

  hasRole(role: UserRole): boolean {
    return this._authToken?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this._authToken ? roles.includes(this._authToken.role as UserRole) : false;
  }

  private setToken(token: AuthToken): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(token));
    this._authToken = token;
  }

  private getTokenFromStorage(): AuthToken | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  private loadTokenFromStorage(): void {
    const token = this.getTokenFromStorage();
    if (token && Date.now() < token.expiresAt) {
      this._authToken = token;
    } else {
      this.logout();
    }
  }

  private generateToken(): string {
    return btoa(`${Date.now()}-${Math.random()}`);
  }
}
