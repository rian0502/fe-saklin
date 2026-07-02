import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, computed, contentChild, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { DataTableColumn } from '../../types/data-table-column.model';
import { SortDirection, SortState } from '../../types/sort-state.model';

@Component({
  selector: 'app-data-table',
  imports: [MatTableModule, MatProgressBarModule, MatIconModule, NgTemplateOutlet],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable<T> {
  readonly columns = input.required<DataTableColumn<T>[]>();
  readonly data = input.required<T[]>();
  readonly loading = input(false);
  readonly sortState = input<SortState | null>(null);

  readonly sortChange = output<SortState>();

  readonly rowActionsTemplate = contentChild<TemplateRef<{ $implicit: T }>>('rowActions');

  readonly displayedColumns = computed(() => {
    const keys = this.columns().map((column) => column.key);
    return this.rowActionsTemplate() ? [...keys, 'actions'] : keys;
  });

  toggleSort(column: DataTableColumn<T>): void {
    if (!column.sortable) {
      return;
    }

    const current = this.sortState();
    const direction: SortDirection =
      current?.field === column.key && current.direction === 'asc' ? 'desc' : 'asc';

    this.sortChange.emit({ field: column.key, direction });
  }
}
