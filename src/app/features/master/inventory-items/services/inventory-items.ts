import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, tap, throwError } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification';
import { PageState } from '../../../../shared/types/page-state.model';
import { QueryParams } from '../../../../shared/types/query-params.model';
import { SortState } from '../../../../shared/types/sort-state.model';
import { InventoryItemsApi } from '../api/inventory-items-api';
import { InventoryItem } from '../models/inventory-item.model';
import { InventoryItemsStore } from '../store/inventory-items-store';

@Injectable({
  providedIn: 'root',
})
export class InventoryItemService {
  private readonly inventoryItemsApi = inject(InventoryItemsApi);
  private readonly store = inject(InventoryItemsStore);
  private readonly notificationService = inject(NotificationService);

  loadInventoryItems(): Observable<void> {
    this.store.loading.set(true);

    return this.inventoryItemsApi.list(this.buildQuery()).pipe(
      tap((response) => {
        this.store.items.set(response.data);
        this.store.pagination.set(response.meta);
      }),
      map(() => void 0),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load inventory items.');
        return throwError(() => error);
      }),
      finalize(() => this.store.loading.set(false)),
    );
  }

  getInventoryItem(id: number): Observable<InventoryItem> {
    return this.inventoryItemsApi.find(id).pipe(
      tap((inventoryItem) => this.store.selectedInventoryItem.set(inventoryItem)),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load inventory item.');
        return throwError(() => error);
      }),
    );
  }

  createInventoryItem(payload: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.inventoryItemsApi.create(payload).pipe(
      tap(() => this.notificationService.success('Inventory item created successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to create inventory item.');
        return throwError(() => error);
      }),
    );
  }

  updateInventoryItem(id: number, payload: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.inventoryItemsApi.update(id, payload).pipe(
      tap(() => this.notificationService.success('Inventory item updated successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to update inventory item.');
        return throwError(() => error);
      }),
    );
  }

  deleteInventoryItem(id: number): Observable<void> {
    return this.inventoryItemsApi.delete(id).pipe(
      tap(() => this.notificationService.success('Inventory item deleted successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to delete inventory item.');
        return throwError(() => error);
      }),
    );
  }

  clearSelectedInventoryItem(): void {
    this.store.selectedInventoryItem.set(null);
  }

  setSearch(search: string): void {
    this.store.search.set(search);
    this.resetToFirstPage();
  }

  setFilters(filters: Record<string, string>): void {
    this.store.filters.set(filters);
    this.resetToFirstPage();
  }

  setSort(sort: SortState): void {
    this.store.sort.set(sort);
  }

  setPage(pageState: PageState): void {
    this.store.pagination.update((meta) => ({
      ...meta,
      currentPage: pageState.page,
      perPage: pageState.perPage,
    }));
  }

  private buildQuery(): QueryParams {
    return {
      page: this.store.pagination().currentPage,
      perPage: this.store.pagination().perPage,
      search: this.store.search() || undefined,
      sort: this.store.sort() ?? undefined,
      filters: this.buildFilters(),
    };
  }

  private buildFilters(): Record<string, string> | undefined {
    const nonEmpty = Object.fromEntries(
      Object.entries(this.store.filters()).filter(([, value]) => value !== ''),
    );

    return Object.keys(nonEmpty).length ? nonEmpty : undefined;
  }

  private resetToFirstPage(): void {
    this.store.pagination.update((meta) => ({ ...meta, currentPage: 1 }));
  }
}
