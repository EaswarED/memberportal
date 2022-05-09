import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class BookableTimeApi {
	private readonly apiController: string = 'class/';

	constructor(private api: BaseApi) {}

	public getScheduleDateList() {
		return this.api.get(this.apiController + 'schedule');
	}
}
