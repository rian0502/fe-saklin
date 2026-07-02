import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseApi } from '../../../../core/api/base.api';
import { Promotion } from '../models/promotion.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionsApi extends BaseApi<Promotion> {
  protected readonly resourceUrl = `${environment.api.baseUrl}/promotions`;
}
