import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class GroupServiceApi {
	private readonly apiController: string = 'group/';

	constructor(private api: BaseApi) {}

	public getGrouplist() {
		return this.api.get(this.apiController + 'cname');
	}
}
