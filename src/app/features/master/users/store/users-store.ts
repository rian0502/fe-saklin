import { Injectable, signal } from '@angular/core';
import { MasterUser } from '../models/master-user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersStore {
  readonly items = signal<MasterUser[]>([]);
  readonly loading = signal(false);
}
