import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class CreateGroupBookApi {
	private readonly apiController: string = 'group/';

	constructor(private api: BaseApi) {}

	public AddGroupBook(data: any) {
		return this.api.post(this.apiController + 'enroll/client', data);
	}
}
