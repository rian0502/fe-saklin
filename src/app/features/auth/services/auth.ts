import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { AuthApi } from '../../../core/api/auth-api';
import { CurrentUserResponse } from '../models/current-user-response.model';
import { LoginRequest } from '../models/login-request.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  readonly currentUser = signal<User | null>(null);
  readonly roles = signal<string[]>([]);
  readonly permissions = signal<string[]>([]);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  /**
   * Sanctum SPA login flow:
   * 1. Fetch the CSRF cookie (required before any stateful Laravel request).
   * 2. Submit credentials to the session-based /web/login endpoint.
   * 3. Fetch the authenticated user + Spatie roles/permissions from /api/me.
   * 4. Hydrate signals and redirect into the admin area.
   *
   * No internal subscribe(): the returned Observable is cold until the
   * caller (e.g. the login component) subscribes to it.
   */
  login(payload: LoginRequest): Observable<void> {
    return this.authApi.getCsrfCookie().pipe(
      // Ignore the csrf-cookie response body; switch to the login request
      // once the XSRF-TOKEN cookie has been set by the browser.
      switchMap(() => this.authApi.login(payload)),
      // Ignore the login response body; the session cookie is now active,
      // so switch to fetching the authoritative current-user payload.
      switchMap(() => this.authApi.me()),
      // Side effect only: hydrate signals and navigate, without altering
      // the emitted value (still the CurrentUserResponse at this point).
      tap((response: CurrentUserResponse) => {
        this.setSession(response);
        void this.router.navigate(['/admin/dashboard']);
      }),
      // Fulfil the Observable<void> contract by discarding the payload
      // now that the side effects above have already consumed it.
      map(() => void 0),
      // Any failure in the chain (bad credentials, network error, csrf
      // failure) lands here: clear partial state and re-throw so the
      // caller's subscribe({ error }) can react (e.g. show a form error).
      catchError((error: unknown) => {
        this.clearSession();
        return throwError(() => error);
      }),
    );
  }

  /**
   * Session restoration flow (e.g. on app bootstrap / hard reload):
   * 1. Ask the backend for the current user via /api/me. No CSRF cookie
   *    fetch is needed first — GET is a "safe" verb and Sanctum does not
   *    require an XSRF token for it.
   * 2. Authenticated (2xx): hydrate signals, emit true.
   * 3. Unauthenticated (401): clear any stale signal state, emit false
   *    instead of propagating the error — "no session" is an expected
   *    outcome here, not a failure the caller needs to handle as an error.
   */
  restoreSession(): Observable<boolean> {
    return this.authApi.me().pipe(
      tap((response: CurrentUserResponse) => this.setSession(response)),
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      }),
    );
  }

  /**
   * Logout flow:
   * 1. POST /web/logout to invalidate the server-side session.
   * 2. Regardless of whether that call succeeds or fails, clear local
   *    signals and navigate to /login — a failed logout request (e.g.
   *    the session was already expired) is not something the caller can
   *    act on, so it must not block the user from being logged out
   *    client-side.
   */
  logout(): Observable<void> {
    return this.authApi.logout().pipe(
      catchError(() => of(undefined)),
      tap(() => {
        this.clearSession();
        void this.router.navigate(['/login']);
      }),
    );
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.roles().includes(role));
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.permissions().includes(permission));
  }

  private setSession(response: CurrentUserResponse): void {
    this.currentUser.set(response.user);
    this.roles.set(response.roles);
    this.permissions.set(response.permissions);
  }

  /**
   * Public so cross-cutting concerns outside this service — namely
   * AuthInterceptor reacting to a 401 from any endpoint — can reset
   * session state without duplicating this logic.
   */
  clearSession(): void {
    this.currentUser.set(null);
    this.roles.set([]);
    this.permissions.set([]);
  }
}