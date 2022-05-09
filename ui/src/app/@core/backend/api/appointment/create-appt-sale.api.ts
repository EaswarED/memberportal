import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class CreateApptSaleApi {
	private readonly apiController: string = 'sale/';

	constructor(private api: BaseApi) {}

	public AddAppointment(data: any) {
		return this.api.post(this.apiController + 'buy/appts', data);
	}
}
