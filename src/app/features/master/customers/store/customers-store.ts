import { Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersStore {
  readonly items = signal<Customer[]>([]);
  readonly loading = signal(false);
}
