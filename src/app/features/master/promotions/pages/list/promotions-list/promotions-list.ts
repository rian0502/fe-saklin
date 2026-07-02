import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, switchMap, tap } from 'rxjs';
import { DataTable } from '../../../../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { FilterPanel } from '../../../../../../shared/components/filter-panel/filter-panel';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';
import { Paginator } from '../../../../../../shared/components/paginator/paginator';
import { SearchBox } from '../../../../../../shared/components/search-box/search-box';
import { DialogService } from '../../../../../../core/services/dialog';
import { DataTableColumn } from '../../../../../../shared/types/data-table-column.model';
import { FilterField } from '../../../../../../shared/types/filter-field.model';
import { PageState } from '../../../../../../shared/types/page-state.model';
import { SortState } from '../../../../../../shared/types/sort-state.model';
import { Promotion } from '../../../models/promotion.model';
import { PromotionService } from '../../../services/promotions';
import { PromotionsStore } from '../../../store/promotions-store';

const COLUMNS: DataTableColumn<Promotion>[] = [
  { key: 'name', label: 'Name', sortable: true, cell: (row) => row.name },
  { key: 'code', label: 'Code', cell: (row) => row.code },
  { key: 'discountPercentage', label: 'Discount (%)', cell: (row) => String(row.discountPercentage) },
  { key: 'startDate', label: 'Start Date', cell: (row) => row.startDate },
  { key: 'endDate', label: 'End Date', cell: (row) => row.endDate },
];

const FILTER_FIELDS: FilterField[] = [{ key: 'code', label: 'Code', type: 'text' }];

@Component({
  selector: 'app-promotions-list',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    DataTable,
    EmptyState,
    FilterPanel,
    PageHeader,
    Paginator,
    SearchBox,
  ],
  templateUrl: './promotions-list.html',
  styleUrl: './promotions-list.scss',
})
export class PromotionsList implements OnInit {
  private readonly promotionService = inject(PromotionService);
  private readonly store = inject(PromotionsStore);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  readonly columns = COLUMNS;
  readonly filterFields = FILTER_FIELDS;

  readonly items = this.store.items;
  readonly loading = this.store.loading;
  readonly sort = this.store.sort;
  readonly length = computed(() => this.store.pagination().total);
  readonly page = computed(() => this.store.pagination().currentPage);
  readonly perPage = computed(() => this.store.pagination().perPage);

  ngOnInit(): void {
    this.refresh();
  }

  onSearchChange(search: string): void {
    this.promotionService.setSearch(search);
    this.refresh();
  }

  onFiltersChange(filters: Record<string, string>): void {
    this.promotionService.setFilters(filters);
    this.refresh();
  }

  onSortChange(sort: SortState): void {
    this.promotionService.setSort(sort);
    this.refresh();
  }

  onPageChange(pageState: PageState): void {
    this.promotionService.setPage(pageState);
    this.refresh();
  }

  deletePromotion(promotion: Promotion): void {
    this.dialogService
      .confirmDelete({ title: 'Delete Promotion', itemLabel: promotion.name })
      .pipe(
        switchMap((confirmed) => (confirmed ? this.promotionService.deletePromotion(promotion.id) : EMPTY)),
        tap(() => this.refresh()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private refresh(): void {
    this.promotionService
      .loadPromotions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
