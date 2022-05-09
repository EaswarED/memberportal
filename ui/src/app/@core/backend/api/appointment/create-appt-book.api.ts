import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class CreateApptBookApi {
	private readonly apiController: string = 'appointment/';

	constructor(private api: BaseApi) {}

	public AddAppointmentBook(data: any) {
		return this.api.post(this.apiController + 'appts/add', data);
	}

	public AddAppointmentPay(data: any) {
		return this.api.post(this.apiController + 'appt/pay', data);
	}

	public AppointmentBook() {
		return this.api.get(this.apiController + 'book/appts');
	}
}
