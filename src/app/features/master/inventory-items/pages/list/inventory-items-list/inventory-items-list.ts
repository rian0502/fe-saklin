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
import { InventoryItem } from '../../../models/inventory-item.model';
import { InventoryItemService } from '../../../services/inventory-items';
import { InventoryItemsStore } from '../../../store/inventory-items-store';

const COLUMNS: DataTableColumn<InventoryItem>[] = [
  { key: 'name', label: 'Name', sortable: true, cell: (row) => row.name },
  { key: 'sku', label: 'SKU', cell: (row) => row.sku },
  { key: 'unit', label: 'Unit', cell: (row) => row.unit },
  { key: 'quantity', label: 'Quantity', cell: (row) => String(row.quantity) },
];

const FILTER_FIELDS: FilterField[] = [
  { key: 'sku', label: 'SKU', type: 'text' },
  { key: 'unit', label: 'Unit', type: 'text' },
];

@Component({
  selector: 'app-inventory-items-list',
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
  templateUrl: './inventory-items-list.html',
  styleUrl: './inventory-items-list.scss',
})
export class InventoryItemsList implements OnInit {
  private readonly inventoryItemService = inject(InventoryItemService);
  private readonly store = inject(InventoryItemsStore);
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
    this.inventoryItemService.setSearch(search);
    this.refresh();
  }

  onFiltersChange(filters: Record<string, string>): void {
    this.inventoryItemService.setFilters(filters);
    this.refresh();
  }

  onSortChange(sort: SortState): void {
    this.inventoryItemService.setSort(sort);
    this.refresh();
  }

  onPageChange(pageState: PageState): void {
    this.inventoryItemService.setPage(pageState);
    this.refresh();
  }

  deleteInventoryItem(inventoryItem: InventoryItem): void {
    this.dialogService
      .confirmDelete({ title: 'Delete Inventory Item', itemLabel: inventoryItem.name })
      .pipe(
        switchMap((confirmed) =>
          confirmed ? this.inventoryItemService.deleteInventoryItem(inventoryItem.id) : EMPTY,
        ),
        tap(() => this.refresh()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private refresh(): void {
    this.inventoryItemService
      .loadInventoryItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
