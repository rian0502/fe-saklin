import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth';

/**
 * Endpoints where a 401 is an expected business outcome (bad credentials),
 * not an expired-session event. Excluded from the auto clear+redirect below
 * so the login form's own error handling still receives the error.
 */
const UNAUTHENTICATED_ENDPOINTS = ['/web/login'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isUnauthenticatedEndpoint = UNAUTHENTICATED_ENDPOINTS.some((endpoint) =>
    req.url.endsWith(endpoint),
  );

  // Request passes through untouched: no Authorization header is added,
  // and any withCredentials/other options set by the calling Api class are
  // preserved as-is since the request is never cloned here.
  return next(req).pipe(
    catchError((error: unknown) => {
      if (!isUnauthenticatedEndpoint && error instanceof HttpErrorResponse && error.status === 401) {
        authService.clearSession();
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
