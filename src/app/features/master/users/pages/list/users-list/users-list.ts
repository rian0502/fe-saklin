import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { Loading } from '../../../../../../shared/components/loading/loading';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';
import { UsersStore } from '../../../store/users-store';

@Component({
  selector: 'app-users-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTableModule, EmptyState, Loading, PageHeader],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {
  private readonly store = inject(UsersStore);

  readonly items = this.store.items;
  readonly loading = this.store.loading;
  readonly displayedColumns = ['name', 'email', 'roles', 'status'];
}
