import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private router: Router) {}

  canActivate(): boolean {
    try {
      if (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('jwt_token')) {
        return true;
      }
    } catch {
      // Em ambiente server-side não há localStorage
    }
    this.router.navigate(['/login']);
    return false;
  }
}

// Exportando como Functional Guard (necessário para o app.routes.ts)
export const canActivateAuth: CanActivateFn = (route, state) => {
  const authGuard = inject(AuthGuard);
  return authGuard.canActivate();
};
