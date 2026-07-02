import { Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageState } from '../../types/page-state.model';

@Component({
  selector: 'app-paginator',
  imports: [MatPaginatorModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
  readonly length = input(0);
  readonly page = input(1);
  readonly perPage = input(10);
  readonly pageSizeOptions = input<number[]>([10, 25, 50, 100]);

  readonly pageChange = output<PageState>();

  onPage(event: PageEvent): void {
    this.pageChange.emit({ page: event.pageIndex + 1, perPage: event.pageSize });
  }
}
