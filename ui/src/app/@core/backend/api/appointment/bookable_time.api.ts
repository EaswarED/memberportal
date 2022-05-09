import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class BookableTimeApi {
	private readonly apiController: string = 'appointment/';

	constructor(private api: BaseApi) {}

	public getBookableTimelist(id: number) {
		return this.api.get(this.apiController + `bookable/items/${id}`);
	}
}
