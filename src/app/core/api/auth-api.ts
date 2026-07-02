import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../features/auth/models/login-request.model';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../features/auth/models/login-response.model';
import { CurrentUserResponse } from '../../features/auth/models/current-user-response.model';

@Injectable({
  providedIn: 'root',
})

export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.api.baseUrl}`

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.api.host}/web/login`, payload, {
      withCredentials: true,
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.api.host}/web/logout`, {}, {
      withCredentials: true
    });
  }

  me(): Observable<CurrentUserResponse> {
    return this.http.get<CurrentUserResponse>(`${this.baseUrl}/me`, {
      withCredentials: true,
    });
  }

  getCsrfCookie(): Observable<void> {
    return this.http.get<void>(
      `${environment.api.host}/sanctum/csrf-cookie`,
      {
        withCredentials: true,
      }
    );
  }
}