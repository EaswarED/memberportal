import { Injectable } from '@angular/core';
import { BaseApi } from '../shared/base.api';
import { Observable } from 'rxjs';

@Injectable()
export class CheckInApi {
	private readonly apiController: string = 'client/';

	constructor(private api: BaseApi) {}

	getCheckinList() {
		return this.api.get(this.apiController + 'check_in');
	}
}
