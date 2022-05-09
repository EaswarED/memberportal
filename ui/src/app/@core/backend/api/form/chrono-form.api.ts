import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class ChronoFormApi {
	private readonly apiController: string = 'form/';

	constructor(private api: BaseApi) {}

	public getList(url: any) {
		return this.api.get(this.apiController + `${url}`);
	}

	public get(id: any) {
		return this.api.get(this.apiController + `clinical/${id}`);
	}

	public save(data: any) {
		return this.api.post(this.apiController + `jot`, data);
	}
}
