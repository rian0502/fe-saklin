import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, tap, throwError } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification';
import { PageState } from '../../../../shared/types/page-state.model';
import { QueryParams } from '../../../../shared/types/query-params.model';
import { SortState } from '../../../../shared/types/sort-state.model';
import { MasterUser } from '../models/master-user.model';
import { UsersApi } from '../api/users-api';
import { UsersStore } from '../store/users-store';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly usersApi = inject(UsersApi);
  private readonly store = inject(UsersStore);
  private readonly notificationService = inject(NotificationService);

  loadUsers(): Observable<void> {
    this.store.loading.set(true);

    return this.usersApi.list(this.buildQuery()).pipe(
      tap((response) => {
        this.store.items.set(response.data);
        this.store.pagination.set(response.meta);
      }),
      map(() => void 0),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load users.');
        return throwError(() => error);
      }),
      finalize(() => this.store.loading.set(false)),
    );
  }

  getUser(id: number): Observable<MasterUser> {
    return this.usersApi.find(id).pipe(
      tap((user) => this.store.selectedUser.set(user)),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load user.');
        return throwError(() => error);
      }),
    );
  }

  createUser(payload: Partial<MasterUser>): Observable<MasterUser> {
    return this.usersApi.create(payload).pipe(
      tap(() => this.notificationService.success('User created successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to create user.');
        return throwError(() => error);
      }),
    );
  }

  updateUser(id: number, payload: Partial<MasterUser>): Observable<MasterUser> {
    return this.usersApi.update(id, payload).pipe(
      tap(() => this.notificationService.success('User updated successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to update user.');
        return throwError(() => error);
      }),
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.usersApi.delete(id).pipe(
      tap(() => this.notificationService.success('User deleted successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to delete user.');
        return throwError(() => error);
      }),
    );
  }

  clearSelectedUser(): void {
    this.store.selectedUser.set(null);
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
