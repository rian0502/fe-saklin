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
import { Machine } from '../../../models/machine.model';
import { MachineService } from '../../../services/machines';
import { MachinesStore } from '../../../store/machines-store';

const COLUMNS: DataTableColumn<Machine>[] = [
  { key: 'code', label: 'Code', sortable: true, cell: (row) => row.code },
  { key: 'machineTypeId', label: 'Machine Type', cell: (row) => String(row.machineTypeId) },
  { key: 'outletId', label: 'Outlet', cell: (row) => String(row.outletId) },
  { key: 'status', label: 'Status', cell: (row) => row.status },
];

const FILTER_FIELDS: FilterField[] = [{ key: 'status', label: 'Status', type: 'text' }];

@Component({
  selector: 'app-machines-list',
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
  templateUrl: './machines-list.html',
  styleUrl: './machines-list.scss',
})
export class MachinesList implements OnInit {
  private readonly machineService = inject(MachineService);
  private readonly store = inject(MachinesStore);
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
    this.machineService.setSearch(search);
    this.refresh();
  }

  onFiltersChange(filters: Record<string, string>): void {
    this.machineService.setFilters(filters);
    this.refresh();
  }

  onSortChange(sort: SortState): void {
    this.machineService.setSort(sort);
    this.refresh();
  }

  onPageChange(pageState: PageState): void {
    this.machineService.setPage(pageState);
    this.refresh();
  }

  deleteMachine(machine: Machine): void {
    this.dialogService
      .confirmDelete({ title: 'Delete Machine', itemLabel: machine.code })
      .pipe(
        switchMap((confirmed) => (confirmed ? this.machineService.deleteMachine(machine.id) : EMPTY)),
        tap(() => this.refresh()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private refresh(): void {
    this.machineService
      .loadMachines()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
