import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class OtherServiceApi {
	private readonly apiController: string = 'site/';

	constructor(private api: BaseApi) {}

	public getProgramClasslist() {
		return this.api.get(this.apiController + 'program/classes');
	}
}
