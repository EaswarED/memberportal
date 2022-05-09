import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LandingClassApi } from '../../api/class/landing.api';

@Injectable()
export class LandingClassService {
	constructor(private api: LandingClassApi) {}

	getLandinglist() {
		return this.api.getLandinglist();
	}
	getClasslist() {
		return this.api.getClasslist();
	}
	getClassSchedulelist(id: any) {
		return this.api.getClassSchedulelist(id);
	}

	type(type: any): Observable<any> {
		return this.api.type(type);
	}

	getList() {
		return this.api.getList();
	}
}
