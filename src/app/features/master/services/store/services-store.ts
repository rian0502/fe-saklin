import { Injectable, signal } from '@angular/core';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class ServicesStore {
  readonly items = signal<Service[]>([]);
  readonly loading = signal(false);
}
