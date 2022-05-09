import { Injectable } from '@angular/core';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class LandingGroupApi {
	private readonly apiController: string = 'class/';

	constructor(private api: BaseApi) {}

	public getLandinglist() {
		return this.api.get(this.apiController + 'landing/groups');
	}

	public getClasslist() {
		return this.api.get(this.apiController + 'description');
	}

	public requestjoin(id: any) {
		return this.api.get(this.apiController + `request/${id}`);
	}

	public getList() {
		return this.api.get(this.apiController + 'group_list');
	}
}
