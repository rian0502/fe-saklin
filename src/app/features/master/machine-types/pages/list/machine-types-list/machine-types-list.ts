import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { Loading } from '../../../../../../shared/components/loading/loading';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';
import { MachineTypesStore } from '../../../store/machine-types-store';

@Component({
  selector: 'app-machine-types-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTableModule, EmptyState, Loading, PageHeader],
  templateUrl: './machine-types-list.html',
  styleUrl: './machine-types-list.scss',
})
export class MachineTypesList {
  private readonly store = inject(MachineTypesStore);

  readonly items = this.store.items;
  readonly loading = this.store.loading;
  readonly displayedColumns = ['name', 'description', 'capacityKg'];
}
