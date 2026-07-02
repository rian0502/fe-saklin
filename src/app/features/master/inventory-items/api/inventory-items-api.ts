import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseApi } from '../../../../core/api/base.api';
import { InventoryItem } from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryItemsApi extends BaseApi<InventoryItem> {
  protected readonly resourceUrl = `${environment.api.baseUrl}/inventory-items`;
}
