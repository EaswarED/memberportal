import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LandingGroupApi } from '../../api/group/landing.api';

@Injectable()
export class LandingGroupService {
	constructor(private api: LandingGroupApi) {}

	getLandinglist() {
		return this.api.getLandinglist();
	}

	getClasslist() {
		return this.api.getClasslist();
	}

	requestjoin(id: any) {
		return this.api.requestjoin(id);
	}

	getList() {
		return this.api.getList();
	}
}
