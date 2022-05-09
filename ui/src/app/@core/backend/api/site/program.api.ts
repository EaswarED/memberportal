import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';
import { LookupType } from '../../../interfaces/shared/lookup-type';

@Injectable()
export class ProgramApi {
	private readonly apiController: string = 'site/';

	constructor(private api: BaseApi) {}

	public getProgramlist(type: string): Observable<LookupType[]> {
		if (type == 'A') {
			return this.api.get(this.apiController + 'program/appts');
		} else if (type == 'C') {
			return this.api.get(this.apiController + 'program/classes');
		} else {
			return this.api.get(this.apiController + 'program/groups');
		}
	}
}
