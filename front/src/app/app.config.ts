import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/http/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Roteamento
    provideRouter(routes),

    // Cliente HTTP: habilita fetch (melhor para SSR) e registra interceptor
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor])
    ),

    // Outros módulos (opcional, mas bom para UX)
    provideAnimations()
  ]
};
