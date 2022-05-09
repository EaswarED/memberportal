import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class BookableTimeApi {
	private readonly apiController: string = 'group/';

	constructor(private api: BaseApi) {}

	public getScheduleDateList() {
		return this.api.get(this.apiController + 'schedules');
	}

	// public getBookableTimelist() {
	// 	return this.api.get(this.apiController + 'bookable_class');
	// }
}
