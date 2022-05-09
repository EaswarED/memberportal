import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LandingApptApi } from '../../api/appointment/landing.api';

@Injectable()
export class LandingApptService {
	constructor(private api: LandingApptApi) {}

	getLandinglist() {
		return this.api.getLandinglist();
	}

	type(type: any): Observable<any> {
		return this.api.type(type);
	}

	getList() {
		return this.api.getList();
	}
}
