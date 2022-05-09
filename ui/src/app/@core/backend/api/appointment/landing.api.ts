import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class LandingApptApi {
	private readonly apiController: string = 'appointment/';

	constructor(private api: BaseApi) {}

	public getLandinglist() {
		return this.api.get(this.apiController + 'landing/appts');
	}

	public type(type: any): Observable<any> {
		return this.api.get(this.apiController + `categories/${type}`);
	}

	public getList() {
		return this.api.get(this.apiController + 'appt_list');
	}
}
