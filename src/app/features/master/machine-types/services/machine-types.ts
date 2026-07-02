import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, tap, throwError } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification';
import { PageState } from '../../../../shared/types/page-state.model';
import { QueryParams } from '../../../../shared/types/query-params.model';
import { SortState } from '../../../../shared/types/sort-state.model';
import { MachineTypesApi } from '../api/machine-types-api';
import { MachineType } from '../models/machine-type.model';
import { MachineTypesStore } from '../store/machine-types-store';

@Injectable({
  providedIn: 'root',
})
export class MachineTypeService {
  private readonly machineTypesApi = inject(MachineTypesApi);
  private readonly store = inject(MachineTypesStore);
  private readonly notificationService = inject(NotificationService);

  loadMachineTypes(): Observable<void> {
    this.store.loading.set(true);

    return this.machineTypesApi.list(this.buildQuery()).pipe(
      tap((response) => {
        this.store.items.set(response.data);
        this.store.pagination.set(response.meta);
      }),
      map(() => void 0),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load machine types.');
        return throwError(() => error);
      }),
      finalize(() => this.store.loading.set(false)),
    );
  }

  getMachineType(id: number): Observable<MachineType> {
    return this.machineTypesApi.find(id).pipe(
      tap((machineType) => this.store.selectedMachineType.set(machineType)),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load machine type.');
        return throwError(() => error);
      }),
    );
  }

  createMachineType(payload: Partial<MachineType>): Observable<MachineType> {
    return this.machineTypesApi.create(payload).pipe(
      tap(() => this.notificationService.success('Machine type created successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to create machine type.');
        return throwError(() => error);
      }),
    );
  }

  updateMachineType(id: number, payload: Partial<MachineType>): Observable<MachineType> {
    return this.machineTypesApi.update(id, payload).pipe(
      tap(() => this.notificationService.success('Machine type updated successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to update machine type.');
        return throwError(() => error);
      }),
    );
  }

  deleteMachineType(id: number): Observable<void> {
    return this.machineTypesApi.delete(id).pipe(
      tap(() => this.notificationService.success('Machine type deleted successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to delete machine type.');
        return throwError(() => error);
      }),
    );
  }

  clearSelectedMachineType(): void {
    this.store.selectedMachineType.set(null);
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
