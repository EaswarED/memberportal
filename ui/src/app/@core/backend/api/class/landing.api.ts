import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class LandingClassApi {
	private readonly apiController: string = 'class/';

	constructor(private api: BaseApi) {}

	public getLandinglist() {
		return this.api.get(this.apiController + 'landing/classes');
	}
	public getClasslist() {
		return this.api.get(this.apiController + 'description');
	}
	public getClassSchedulelist(id: any) {
		return this.api.get(this.apiController + `class_detail/${id}`);
	}

	public type(type: any): Observable<any> {
		return this.api.get(this.apiController + `categories/${type}`);
	}

	public getList() {
		return this.api.get(this.apiController + 'classes_list');
	}
}
