import { Injectable, signal } from '@angular/core';
import { Machine } from '../models/machine.model';

@Injectable({
  providedIn: 'root',
})
export class MachinesStore {
  readonly items = signal<Machine[]>([]);
  readonly loading = signal(false);
}
