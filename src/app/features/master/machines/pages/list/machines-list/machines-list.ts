import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { Loading } from '../../../../../../shared/components/loading/loading';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';
import { MachinesStore } from '../../../store/machines-store';

@Component({
  selector: 'app-machines-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTableModule, EmptyState, Loading, PageHeader],
  templateUrl: './machines-list.html',
  styleUrl: './machines-list.scss',
})
export class MachinesList {
  private readonly store = inject(MachinesStore);

  readonly items = this.store.items;
  readonly loading = this.store.loading;
  readonly displayedColumns = ['code', 'machineTypeId', 'outletId', 'status'];
}
