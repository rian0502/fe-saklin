import { Injectable, signal } from '@angular/core';
import { Promotion } from '../models/promotion.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionsStore {
  readonly items = signal<Promotion[]>([]);
  readonly loading = signal(false);
}
