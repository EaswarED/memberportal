import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class CalendarBookConsultApi {
	private readonly apiController: string = 'appointment/';

	constructor(private api: BaseApi) {}

	public GetCalendarBookConsult() {
		return this.api.get(this.apiController + 'consult');
	}
}
