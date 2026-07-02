import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, switchMap, tap } from 'rxjs';
import { DataTable } from '../../../../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';
import { Paginator } from '../../../../../../shared/components/paginator/paginator';
import { SearchBox } from '../../../../../../shared/components/search-box/search-box';
import { DialogService } from '../../../../../../core/services/dialog';
import { DataTableColumn } from '../../../../../../shared/types/data-table-column.model';
import { PageState } from '../../../../../../shared/types/page-state.model';
import { SortState } from '../../../../../../shared/types/sort-state.model';
import { MachineType } from '../../../models/machine-type.model';
import { MachineTypeService } from '../../../services/machine-types';
import { MachineTypesStore } from '../../../store/machine-types-store';

const COLUMNS: DataTableColumn<MachineType>[] = [
  { key: 'name', label: 'Name', sortable: true, cell: (row) => row.name },
  { key: 'description', label: 'Description', cell: (row) => row.description },
  { key: 'capacityKg', label: 'Capacity (kg)', cell: (row) => String(row.capacityKg) },
];

@Component({
  selector: 'app-machine-types-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, DataTable, EmptyState, PageHeader, Paginator, SearchBox],
  templateUrl: './machine-types-list.html',
  styleUrl: './machine-types-list.scss',
})
export class MachineTypesList implements OnInit {
  private readonly machineTypeService = inject(MachineTypeService);
  private readonly store = inject(MachineTypesStore);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  readonly columns = COLUMNS;

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
    this.machineTypeService.setSearch(search);
    this.refresh();
  }

  onSortChange(sort: SortState): void {
    this.machineTypeService.setSort(sort);
    this.refresh();
  }

  onPageChange(pageState: PageState): void {
    this.machineTypeService.setPage(pageState);
    this.refresh();
  }

  deleteMachineType(machineType: MachineType): void {
    this.dialogService
      .confirmDelete({ title: 'Delete Machine Type', itemLabel: machineType.name })
      .pipe(
        switchMap((confirmed) =>
          confirmed ? this.machineTypeService.deleteMachineType(machineType.id) : EMPTY,
        ),
        tap(() => this.refresh()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private refresh(): void {
    this.machineTypeService
      .loadMachineTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
