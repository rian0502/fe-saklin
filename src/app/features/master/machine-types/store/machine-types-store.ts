import { Injectable, signal } from '@angular/core';
import { MachineType } from '../models/machine-type.model';

@Injectable({
  providedIn: 'root',
})
export class MachineTypesStore {
  readonly items = signal<MachineType[]>([]);
  readonly loading = signal(false);
}
