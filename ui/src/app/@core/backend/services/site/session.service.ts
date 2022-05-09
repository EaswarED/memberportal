import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SessionLookupType } from '../../../interfaces/shared/lookup-type';
import { SessionApi } from '../../api/site/session.api';

@Injectable()
export class SessionService {
	constructor(private api: SessionApi) {}

	getApptSessionList(): Observable<SessionLookupType[]> {
		return this.api.getSessionlist('A');
	}

	getClassSessionList(): Observable<SessionLookupType[]> {
		return this.api.getSessionlist('C');
	}

	getGroupSessionList(): Observable<SessionLookupType[]> {
		return this.api.getSessionlist('G');
	}
}
