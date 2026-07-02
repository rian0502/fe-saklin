import { SortState } from './sort-state.model';

export interface QueryParams {
    page: number;
    perPage: number;
    search?: string;
    sort?: SortState;
    filters?: Record<string, string | number | boolean>;
}
