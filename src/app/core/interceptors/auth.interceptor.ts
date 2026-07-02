import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth';

const EXPECTED_401_ENDPOINTS = ['/web/login', '/web/logout', '/api/me'];

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isExpected401Endpoint = EXPECTED_401_ENDPOINTS.some((endpoint) =>
    req.url.endsWith(endpoint),
  );

  // Manually attach XSRF header since Angular's built-in XSRF interceptor
  // skips absolute cross-origin URLs (our API is on a different port).
  let outgoingReq = req;
  if (!['GET', 'HEAD'].includes(req.method)) {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
      outgoingReq = req.clone({
        headers: req.headers.set('X-XSRF-TOKEN', token),
      });
    }
  }

  return next(outgoingReq).pipe(
    catchError((error: unknown) => {
      const isUnexpected401 =
        !isExpected401Endpoint && error instanceof HttpErrorResponse && error.status === 401;

      if (isUnexpected401) {
        authService.clearSession();
      }

      return throwError(() => error);
    }),
  );
};