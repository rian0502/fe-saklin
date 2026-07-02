import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { QueryParams } from '../../shared/types/query-params.model';
import { PaginatedResponse, PaginationMeta } from '../types/paginated-response.model';

/**
 * Shape Laravel's paginator actually sends on the wire (snake_case). Kept
 * private to this file — nothing outside BaseApi should ever need to know
 * about it, since the adapter below normalizes every response to the
 * camelCase `PaginatedResponse<T>` before it leaves this class.
 */
interface LaravelPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface LaravelPaginatedResponse<T> {
  data: T[];
  meta: LaravelPaginationMeta;
}

/**
 * Base CRUD client for Laravel Sanctum SPA endpoints. Concrete Api classes
 * only need to supply `resourceUrl`; all requests carry withCredentials so
 * the session cookie is sent, consistent with AuthApi.
 */
export abstract class BaseApi<T, TId = number> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly resourceUrl: string;

  list(query?: QueryParams): Observable<PaginatedResponse<T>> {
    return this.http
      .get<LaravelPaginatedResponse<T>>(this.resourceUrl, {
        params: this.buildParams(query),
        withCredentials: true,
      })
      .pipe(map((response) => this.toPaginatedResponse(response)));
  }

  find(id: TId): Observable<T> {
    return this.http.get<T>(`${this.resourceUrl}/${id}`, { withCredentials: true });
  }

  create(payload: Partial<T>): Observable<T> {
    return this.http.post<T>(this.resourceUrl, payload, { withCredentials: true });
  }

  update(id: TId, payload: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.resourceUrl}/${id}`, payload, { withCredentials: true });
  }

  delete(id: TId): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`, { withCredentials: true });
  }

  private buildParams(query?: QueryParams): HttpParams {
    let params = new HttpParams();

    if (!query) {
      return params;
    }

    params = params.set('page', query.page).set('per_page', query.perPage);

    if (query.search) {
      params = params.set('search', query.search);
    }

    if (query.sort) {
      params = params.set('sort', query.sort.field).set('sort_direction', query.sort.direction);
    }

    if (query.filters) {
      for (const [key, value] of Object.entries(query.filters)) {
        params = params.set(key, String(value));
      }
    }

    return params;
  }

  private toPaginatedResponse(response: LaravelPaginatedResponse<T>): PaginatedResponse<T> {
    const meta: PaginationMeta = {
      currentPage: response.meta.current_page,
      lastPage: response.meta.last_page,
      perPage: response.meta.per_page,
      total: response.meta.total,
    };

    return { data: response.data, meta };
  }
}
