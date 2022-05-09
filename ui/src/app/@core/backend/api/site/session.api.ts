import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';
import { SessionLookupType } from '../../../interfaces/shared/lookup-type';

@Injectable()
export class SessionApi {
	private readonly apiController: string = 'site/';

	constructor(private api: BaseApi) {}

	public getSessionlist(type: string): Observable<SessionLookupType[]> {
		if (type == 'A') {
			return this.api.get(this.apiController + 'session/appts');
		} else if (type == 'C') {
			return this.api.get(this.apiController + 'session/classes');
		} else {
			return this.api.get(this.apiController + 'session/groups');
		}
	}
}
