import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class CreateProfileApi {
	private readonly apiController: string = 'client/';

	constructor(private api: BaseApi) {}

	public AddProfileBook(data: any) {
		return this.api.post(this.apiController + 'add', data);
	}
}
