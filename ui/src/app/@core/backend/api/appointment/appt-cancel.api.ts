import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class ApptCancelApi {
	private readonly apiController: string = 'appointment/';

	constructor(private api: BaseApi) {}

	// public AddApptCancel(data: any) {
	// 	return this.api.post(this.apiController + 'appts/cancel', data);
	// }
	public AddApptCancel(bookingId: number) {
		return this.api.get(this.apiController + `cancel/${bookingId}`);
	}
	public getSummaryCancel(bookingId: number) {
		return this.api.get(this.apiController + `cancel/summary/${bookingId}`);
	}
	public getReschedule(bookingId: number) {
		return this.api.get(
			this.apiController + `reschedule/appt/${bookingId}`
		);
	}
	public AddReschedule(data: any) {
		return this.api.post(this.apiController + 'reschedule/appt', data);
	}
}
