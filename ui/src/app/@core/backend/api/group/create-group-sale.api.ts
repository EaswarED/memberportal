import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class CreateGroupSaleApi {
	private readonly apiController: string = 'sale/';

	constructor(private api: BaseApi) {}

	public AddGroup(data: any) {
		return this.api.post(this.apiController + 'buy/enrollments', data);
	}
}
