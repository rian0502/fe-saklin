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
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customers';
import { CustomersStore } from '../../../store/customers-store';

const COLUMNS: DataTableColumn<Customer>[] = [
  { key: 'name', label: 'Name', sortable: true, cell: (row) => row.name },
  { key: 'phone', label: 'Phone', cell: (row) => row.phone },
  { key: 'email', label: 'Email', sortable: true, cell: (row) => row.email },
  { key: 'address', label: 'Address', cell: (row) => row.address },
];

const FILTER_FIELDS: FilterField[] = [
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'text' },
];

@Component({
  selector: 'app-customers-list',
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
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.scss',
})
export class CustomersList implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly store = inject(CustomersStore);
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
    this.customerService.setSearch(search);
    this.refresh();
  }

  onFiltersChange(filters: Record<string, string>): void {
    this.customerService.setFilters(filters);
    this.refresh();
  }

  onSortChange(sort: SortState): void {
    this.customerService.setSort(sort);
    this.refresh();
  }

  onPageChange(pageState: PageState): void {
    this.customerService.setPage(pageState);
    this.refresh();
  }

  deleteCustomer(customer: Customer): void {
    this.dialogService
      .confirmDelete({ title: 'Delete Customer', itemLabel: customer.name })
      .pipe(
        switchMap((confirmed) => (confirmed ? this.customerService.deleteCustomer(customer.id) : EMPTY)),
        tap(() => this.refresh()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private refresh(): void {
    this.customerService
      .loadCustomers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
