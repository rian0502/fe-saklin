import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseApi } from '../../../../core/api/base.api';
import { MachineType } from '../models/machine-type.model';

@Injectable({
  providedIn: 'root',
})
export class MachineTypesApi extends BaseApi<MachineType> {
  protected readonly resourceUrl = `${environment.api.baseUrl}/machine-types`;
}
