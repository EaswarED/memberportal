import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class UserProfileApi {
	private readonly apiController: string = 'client/';

	constructor(private api: BaseApi) {}

	public getUserProfileDetails(id: any) {
		return this.api.get(this.apiController + `view/${id}`);
	}
	public getUserCompanyList() {
		return this.api.get(this.apiController + `company`);
	}
}
