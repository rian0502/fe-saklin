import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, tap, throwError } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification';
import { PageState } from '../../../../shared/types/page-state.model';
import { QueryParams } from '../../../../shared/types/query-params.model';
import { SortState } from '../../../../shared/types/sort-state.model';
import { PromotionsApi } from '../api/promotions-api';
import { Promotion } from '../models/promotion.model';
import { PromotionsStore } from '../store/promotions-store';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private readonly promotionsApi = inject(PromotionsApi);
  private readonly store = inject(PromotionsStore);
  private readonly notificationService = inject(NotificationService);

  loadPromotions(): Observable<void> {
    this.store.loading.set(true);

    return this.promotionsApi.list(this.buildQuery()).pipe(
      tap((response) => {
        this.store.items.set(response.data);
        this.store.pagination.set(response.meta);
      }),
      map(() => void 0),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load promotions.');
        return throwError(() => error);
      }),
      finalize(() => this.store.loading.set(false)),
    );
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.promotionsApi.find(id).pipe(
      tap((promotion) => this.store.selectedPromotion.set(promotion)),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to load promotion.');
        return throwError(() => error);
      }),
    );
  }

  createPromotion(payload: Partial<Promotion>): Observable<Promotion> {
    return this.promotionsApi.create(payload).pipe(
      tap(() => this.notificationService.success('Promotion created successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to create promotion.');
        return throwError(() => error);
      }),
    );
  }

  updatePromotion(id: number, payload: Partial<Promotion>): Observable<Promotion> {
    return this.promotionsApi.update(id, payload).pipe(
      tap(() => this.notificationService.success('Promotion updated successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to update promotion.');
        return throwError(() => error);
      }),
    );
  }

  deletePromotion(id: number): Observable<void> {
    return this.promotionsApi.delete(id).pipe(
      tap(() => this.notificationService.success('Promotion deleted successfully.')),
      catchError((error: unknown) => {
        this.notificationService.error('Failed to delete promotion.');
        return throwError(() => error);
      }),
    );
  }

  clearSelectedPromotion(): void {
    this.store.selectedPromotion.set(null);
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
