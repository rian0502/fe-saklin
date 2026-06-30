import { Injectable, computed, inject, signal } from '@angular/core';
import { User } from '../models/user.model';
import { AuthApi } from '../../../core/api/auth-api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router)
  readonly currentUser = signal<User | null>(null);
  readonly token = signal<string | null>(null);
  readonly roles = signal<string[]>([]);
  readonly permissions = signal<string[]>([]);
  readonly isAuthenticated = computed(() => this.token() !== null);
}