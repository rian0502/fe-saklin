import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { Loading } from '../../../../../../shared/components/loading/loading';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';
import { InventoryItemsStore } from '../../../store/inventory-items-store';

@Component({
  selector: 'app-inventory-items-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTableModule, EmptyState, Loading, PageHeader],
  templateUrl: './inventory-items-list.html',
  styleUrl: './inventory-items-list.scss',
})
export class InventoryItemsList {
  private readonly store = inject(InventoryItemsStore);

  readonly items = this.store.items;
  readonly loading = this.store.loading;
  readonly displayedColumns = ['name', 'sku', 'unit', 'quantity'];
}
