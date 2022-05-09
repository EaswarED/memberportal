import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class GroupJoinApi {
	private readonly apiController: string = 'class/';

	constructor(private api: BaseApi) {}

	public groupJoin(id: any) {
		return this.api.get(this.apiController + `group_join/${id}`);
	}
}
