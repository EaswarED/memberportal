import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class ApptJoinApi {
	private readonly apiController: string = 'appointment/';

	constructor(private api: BaseApi) {}

	public apptJoin(id: any) {
		return this.api.get(this.apiController + `join/${id}`);
	}

	public apptCheckin(id: any) {
		return this.api.get(this.apiController + `checkin/${id}`);
	}
}
