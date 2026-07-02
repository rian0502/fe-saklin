import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseApi } from '../../../../core/api/base.api';
import { Machine } from '../models/machine.model';

@Injectable({
  providedIn: 'root',
})
export class MachinesApi extends BaseApi<Machine> {
  protected readonly resourceUrl = `${environment.api.baseUrl}/machines`;
}
