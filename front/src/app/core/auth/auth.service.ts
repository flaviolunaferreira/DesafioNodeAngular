import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
interface AuthResponse {
  token: string;
}

interface UserCredentials {
  email: string;
  senha: string;
}

interface UserRegistration extends UserCredentials {
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      return !!localStorage.getItem('jwt_token');
    } catch {
      return false;
    }
  }

  private setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
    this.isAuthenticatedSubject.next(true);
  }

  register(user: UserRegistration): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: UserCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.router.navigate(['/todos']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
}
