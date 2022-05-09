import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateGroupSaleApi } from '../../api/group/create-group-sale.api';

@Injectable()
export class CreateGroupSaleService {
	constructor(private api: CreateGroupSaleApi) {}

	AddGroup(data: any) {
		return this.api.AddGroup(data);
	}
}
