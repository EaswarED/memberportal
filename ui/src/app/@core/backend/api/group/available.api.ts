import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class AvailableTimeApi {
	private readonly apiController: string = 'appointment/';

	constructor(private api: BaseApi) {}

	public getAvailableTimelist() {
		return this.api.get(this.apiController + 'available/dates');
	}
}
