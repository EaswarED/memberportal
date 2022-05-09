import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OtherServiceApi } from '../../api/appointment/other-service.api';

@Injectable()
export class OtherService {
	constructor(private api: OtherServiceApi) {}

	getProgramApptlist() {
		return this.api.getProgramApptlist();
	}

	getProgramClasslist() {
		return this.api.getProgramClasslist();
	}
	getClasslist() {
		return this.api.getClasslist();
	}

	getSessionApptList() {
		return this.api.getSessionApptList();
	}

	getSessionClasslist() {
		return this.api.getSessionClasslist();
	}
	getSessionGrouplist() {
		return this.api.getSessionGrouplist();
	}
}
