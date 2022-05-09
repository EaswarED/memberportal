import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class OtherServiceApi {
	private readonly apiController: string = 'site/';

	constructor(private api: BaseApi) {}

	public getProgramApptlist() {
		return this.api.get(this.apiController + 'program/appts');
	}

	public getProgramClasslist() {
		return this.api.get(this.apiController + 'program/classes');
	}

	public getClasslist() {
		return this.api.get(this.apiController + 'classes/description');
	}

	public getSessionApptList() {
		return this.api.get(this.apiController + 'session/appts');
	}

	public getSessionClasslist() {
		return this.api.get(this.apiController + 'session/classes');
	}

	public getSessionGrouplist() {
		return this.api.get(this.apiController + 'session/groups');
	}
}
