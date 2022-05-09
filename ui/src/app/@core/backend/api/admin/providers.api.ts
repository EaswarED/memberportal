import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class ProviderConfigApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public getProviderConfiglist() {
		return this.api.get(this.apiController + 'instructor_list');
	}

	public getProviderConfigDetails(id: number) {
		return this.api.get(this.apiController + `instructor/${id}`);
	}

	public AddProviderConfiglist(data: any) {
		return this.api.post(this.apiController + 'add_staff', data);
	}
	public RemoveClassProviderConfiglist(data: any) {
		return this.api.post(this.apiController + 'remove_staff', data);
	}
	public save(data: any) {
		return this.api.post(this.apiController + 'instructor/save', data);
	}
}
