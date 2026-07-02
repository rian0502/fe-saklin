import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, tap, throwError } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification';
import { PageState } from '../../../../shared/types/page-state.model';
import { QueryParams } from '../../../../shared/types/query-params.model';
import { SortState } from '../../../../shared/types/sort-state.model';
import { ServicesApi } from '../api/services-api';
import { Service } from '../models/service.model';
import { ServicesStore } from '../store/services-store';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private readonly servicesApi = inject(ServicesApi);
  private readonly store = inject(ServicesStore);
  private readonly notificationService = inject(NotificationService);

  loadServices(): Observable<void> {
    this.store.loading.set(true);

    return this.servicesApi.list(this.buildQuery()).pipe(
      tap((response) => {
        this.store.items.set(response.data);
        this.store.pagination.set(response.meta);
      }),
      map(() => void 0),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load services.');
        return throwError(() => error);
      }),
      finalize(() => this.store.loading.set(false)),
    );
  }

  getService(id: number): Observable<Service> {
    return this.servicesApi.find(id).pipe(
      tap((service) => this.store.selectedService.set(service)),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load service.');
        return throwError(() => error);
      }),
    );
  }

  createService(payload: Partial<Service>): Observable<Service> {
    return this.servicesApi.create(payload).pipe(
      tap(() => this.notificationService.success('Service created successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to create service.');
        return throwError(() => error);
      }),
    );
  }

  updateService(id: number, payload: Partial<Service>): Observable<Service> {
    return this.servicesApi.update(id, payload).pipe(
      tap(() => this.notificationService.success('Service updated successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to update service.');
        return throwError(() => error);
      }),
    );
  }

  deleteService(id: number): Observable<void> {
    return this.servicesApi.delete(id).pipe(
      tap(() => this.notificationService.success('Service deleted successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to delete service.');
        return throwError(() => error);
      }),
    );
  }

  clearSelectedService(): void {
    this.store.selectedService.set(null);
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
