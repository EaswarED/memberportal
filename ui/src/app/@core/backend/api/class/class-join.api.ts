import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class ClassJoinApi {
	private readonly apiController: string = 'class/';

	constructor(private api: BaseApi) {}

	public classJoin(id: any) {
		return this.api.get(this.apiController + `join/${id}`);
	}

	public classCheckin(id: any) {
		return this.api.get(this.apiController + `checkin/${id}`);
	}
}
