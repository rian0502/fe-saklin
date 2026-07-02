import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseApi } from '../../../../core/api/base.api';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class ServicesApi extends BaseApi<Service> {
  protected readonly resourceUrl = `${environment.api.baseUrl}/services`;
}
