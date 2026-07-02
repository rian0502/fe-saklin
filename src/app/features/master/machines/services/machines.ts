import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, tap, throwError } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification';
import { PageState } from '../../../../shared/types/page-state.model';
import { QueryParams } from '../../../../shared/types/query-params.model';
import { SortState } from '../../../../shared/types/sort-state.model';
import { MachinesApi } from '../api/machines-api';
import { Machine } from '../models/machine.model';
import { MachinesStore } from '../store/machines-store';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  private readonly machinesApi = inject(MachinesApi);
  private readonly store = inject(MachinesStore);
  private readonly notificationService = inject(NotificationService);

  loadMachines(): Observable<void> {
    this.store.loading.set(true);

    return this.machinesApi.list(this.buildQuery()).pipe(
      tap((response) => {
        this.store.items.set(response.data);
        this.store.pagination.set(response.meta);
      }),
      map(() => void 0),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load machines.');
        return throwError(() => error);
      }),
      finalize(() => this.store.loading.set(false)),
    );
  }

  getMachine(id: number): Observable<Machine> {
    return this.machinesApi.find(id).pipe(
      tap((machine) => this.store.selectedMachine.set(machine)),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load machine.');
        return throwError(() => error);
      }),
    );
  }

  createMachine(payload: Partial<Machine>): Observable<Machine> {
    return this.machinesApi.create(payload).pipe(
      tap(() => this.notificationService.success('Machine created successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to create machine.');
        return throwError(() => error);
      }),
    );
  }

  updateMachine(id: number, payload: Partial<Machine>): Observable<Machine> {
    return this.machinesApi.update(id, payload).pipe(
      tap(() => this.notificationService.success('Machine updated successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to update machine.');
        return throwError(() => error);
      }),
    );
  }

  deleteMachine(id: number): Observable<void> {
    return this.machinesApi.delete(id).pipe(
      tap(() => this.notificationService.success('Machine deleted successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to delete machine.');
        return throwError(() => error);
      }),
    );
  }

  clearSelectedMachine(): void {
    this.store.selectedMachine.set(null);
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
