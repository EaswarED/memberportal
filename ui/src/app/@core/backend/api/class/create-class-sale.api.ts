import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class CreateClassSaleApi {
	private readonly apiController: string = 'sale/';

	constructor(private api: BaseApi) {}

	public AddClass(data: any) {
		return this.api.post(this.apiController + 'buy/classes', data);
	}
}
