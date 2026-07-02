import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, tap, throwError } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification';
import { PageState } from '../../../../shared/types/page-state.model';
import { QueryParams } from '../../../../shared/types/query-params.model';
import { SortState } from '../../../../shared/types/sort-state.model';
import { CustomersApi } from '../api/customers-api';
import { Customer } from '../models/customer.model';
import { CustomersStore } from '../store/customers-store';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly customersApi = inject(CustomersApi);
  private readonly store = inject(CustomersStore);
  private readonly notificationService = inject(NotificationService);

  /**
   * Reads the current search/filter/sort/pagination state directly off the
   * store and fetches accordingly — the list page only needs to update that
   * state and call this, it never has to build a QueryParams itself.
   */
  loadCustomers(): Observable<void> {
    this.store.loading.set(true);

    return this.customersApi.list(this.buildQuery()).pipe(
      tap((response) => {
        this.store.items.set(response.data);
        this.store.pagination.set(response.meta);
      }),
      map(() => void 0),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load customers.');
        return throwError(() => error);
      }),
      finalize(() => this.store.loading.set(false)),
    );
  }

  getCustomer(id: number): Observable<Customer> {
    return this.customersApi.find(id).pipe(
      tap((customer) => this.store.selectedCustomer.set(customer)),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load customer.');
        return throwError(() => error);
      }),
    );
  }

  createCustomer(payload: Partial<Customer>): Observable<Customer> {
    return this.customersApi.create(payload).pipe(
      tap(() => this.notificationService.success('Customer created successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to create customer.');
        return throwError(() => error);
      }),
    );
  }

  updateCustomer(id: number, payload: Partial<Customer>): Observable<Customer> {
    return this.customersApi.update(id, payload).pipe(
      tap(() => this.notificationService.success('Customer updated successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to update customer.');
        return throwError(() => error);
      }),
    );
  }

  deleteCustomer(id: number): Observable<void> {
    return this.customersApi.delete(id).pipe(
      tap(() => this.notificationService.success('Customer deleted successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to delete customer.');
        return throwError(() => error);
      }),
    );
  }

  /**
   * Synchronous state reset — not HTTP-backed, so it doesn't return an
   * Observable. Exists so the form page can clear stale selection state on
   * exit without reaching into CustomersStore directly (store mutation stays
   * confined to this service).
   */
  clearSelectedCustomer(): void {
    this.store.selectedCustomer.set(null);
  }

  /**
   * The following setters exist so the list page can update query state
   * without mutating CustomersStore directly — same rule as above. Search
   * and filter changes also reset pagination to page 1, since the previous
   * page position is meaningless against a new result set; that's a query
   * rule, not presentation logic, so it belongs here rather than in the
   * component.
   */
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
