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
import { MasterUser } from '../../../models/master-user.model';
import { UserService } from '../../../services/users';
import { UsersStore } from '../../../store/users-store';

const COLUMNS: DataTableColumn<MasterUser>[] = [
  { key: 'name', label: 'Name', sortable: true, cell: (row) => row.name },
  { key: 'email', label: 'Email', sortable: true, cell: (row) => row.email },
  { key: 'roles', label: 'Roles', cell: (row) => row.roles.join(', ') },
  { key: 'status', label: 'Status', cell: (row) => row.status },
];

const FILTER_FIELDS: FilterField[] = [{ key: 'status', label: 'Status', type: 'text' }];

@Component({
  selector: 'app-users-list',
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
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList implements OnInit {
  private readonly userService = inject(UserService);
  private readonly store = inject(UsersStore);
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
    this.userService.setSearch(search);
    this.refresh();
  }

  onFiltersChange(filters: Record<string, string>): void {
    this.userService.setFilters(filters);
    this.refresh();
  }

  onSortChange(sort: SortState): void {
    this.userService.setSort(sort);
    this.refresh();
  }

  onPageChange(pageState: PageState): void {
    this.userService.setPage(pageState);
    this.refresh();
  }

  deleteUser(user: MasterUser): void {
    this.dialogService
      .confirmDelete({ title: 'Delete User', itemLabel: user.name })
      .pipe(
        switchMap((confirmed) => (confirmed ? this.userService.deleteUser(user.id) : EMPTY)),
        tap(() => this.refresh()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private refresh(): void {
    this.userService
      .loadUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
