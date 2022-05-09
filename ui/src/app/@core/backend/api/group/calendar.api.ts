import { Injectable } from '@angular/core';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class CalendarApi {
	private readonly apiController: string = 'classes/';

	constructor(private api: BaseApi) {}

	public getCalendarlist() {
		return this.api.get(this.apiController + 'landing/classes');
	}
}
