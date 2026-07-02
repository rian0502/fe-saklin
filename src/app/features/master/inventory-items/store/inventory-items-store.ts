import { Injectable, signal } from '@angular/core';
import { PaginationMeta } from '../../../../core/types/paginated-response.model';
import { SortState } from '../../../../shared/types/sort-state.model';
import { InventoryItem } from '../models/inventory-item.model';

const DEFAULT_PAGINATION: PaginationMeta = {
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0,
};

@Injectable({
  providedIn: 'root',
})
export class InventoryItemsStore {
  readonly items = signal<InventoryItem[]>([]);
  readonly selectedInventoryItem = signal<InventoryItem | null>(null);
  readonly loading = signal(false);
  readonly pagination = signal<PaginationMeta>(DEFAULT_PAGINATION);
  readonly search = signal('');
  readonly filters = signal<Record<string, string>>({});
  readonly sort = signal<SortState | null>(null);
}
