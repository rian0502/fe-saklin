import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { Loading } from '../../../../../../shared/components/loading/loading';
import { PageHeader } from '../../../../../../shared/components/page-header/page-header';
import { PromotionsStore } from '../../../store/promotions-store';

@Component({
  selector: 'app-promotions-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTableModule, EmptyState, Loading, PageHeader],
  templateUrl: './promotions-list.html',
  styleUrl: './promotions-list.scss',
})
export class PromotionsList {
  private readonly store = inject(PromotionsStore);

  readonly items = this.store.items;
  readonly loading = this.store.loading;
  readonly displayedColumns = ['name', 'code', 'discountPercentage', 'startDate', 'endDate'];
}
