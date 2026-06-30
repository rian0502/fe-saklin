import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../features/auth/models/login-request.model';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../features/auth/models/login-response.model';

@Injectable({
  providedIn: 'root',
})

export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.api.baseUrl}`

  login(payload: LoginRequest) : Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload);
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  me() {
    return this.http.get(`${this.baseUrl}/me`);
  }

  refresh() {
    return this.http.post(`${this.baseUrl}/refresh`, {});
  }
}
