import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class ApptConfigApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public getList() {
		return this.api.get(this.apiController + 'appts');
	}

	public get(id: any): Observable<any> {
		return this.api.get(this.apiController + `appt/${id}`);
	}

	public save(data: any) {
		return this.api.post(this.apiController + 'appt/save', data);
	}

	public AddApptProviderConfiglist(data: any) {
		return this.api.post(this.apiController + 'add_staff', data);
	}

	public UpdateApptCompany(data: any) {
		return this.api.post(this.apiController + 'add_company', data);
	}

	public classArchive(data: any) {
		return this.api.post(this.apiController + 'delete_company', data);
	}
}
