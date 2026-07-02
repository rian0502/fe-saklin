import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseApi } from '../../../../core/api/base.api';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersApi extends BaseApi<Customer> {
  protected readonly resourceUrl = `${environment.api.baseUrl}/customers`;
}
