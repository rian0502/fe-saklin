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
import { Service } from '../../../models/service.model';
import { ServiceService } from '../../../services/services';
import { ServicesStore } from '../../../store/services-store';

const COLUMNS: DataTableColumn<Service>[] = [
  { key: 'name', label: 'Name', sortable: true, cell: (row) => row.name },
  { key: 'price', label: 'Price', cell: (row) => String(row.price) },
  { key: 'durationMinutes', label: 'Duration (min)', cell: (row) => String(row.durationMinutes) },
];

@Component({
  selector: 'app-services-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, DataTable, EmptyState, PageHeader, Paginator, SearchBox],
  templateUrl: './services-list.html',
  styleUrl: './services-list.scss',
})
export class ServicesList implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly store = inject(ServicesStore);
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
    this.serviceService.setSearch(search);
    this.refresh();
  }

  onSortChange(sort: SortState): void {
    this.serviceService.setSort(sort);
    this.refresh();
  }

  onPageChange(pageState: PageState): void {
    this.serviceService.setPage(pageState);
    this.refresh();
  }

  deleteService(service: Service): void {
    this.dialogService
      .confirmDelete({ title: 'Delete Service', itemLabel: service.name })
      .pipe(
        switchMap((confirmed) => (confirmed ? this.serviceService.deleteService(service.id) : EMPTY)),
        tap(() => this.refresh()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private refresh(): void {
    this.serviceService
      .loadServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
