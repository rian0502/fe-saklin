import { Injectable, signal } from '@angular/core';
import { InventoryItem } from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryItemsStore {
  readonly items = signal<InventoryItem[]>([]);
  readonly loading = signal(false);
}
