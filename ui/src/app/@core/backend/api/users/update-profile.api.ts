import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class UpdateProfileApi {
	private readonly apiController: string = 'client/';

	constructor(private api: BaseApi) {}

	public UpdateProfileUser(data: any) {
		return this.api.post(this.apiController + 'profile', data);
	}
}
