import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseApi } from '../../../../core/api/base.api';
import { MasterUser } from '../models/master-user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersApi extends BaseApi<MasterUser> {
  protected readonly resourceUrl = `${environment.api.baseUrl}/users`;
}
