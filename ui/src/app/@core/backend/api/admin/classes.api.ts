import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class ClassConfigApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public getlist() {
		return this.api.get(this.apiController + 'classes');
	}

	public get(id: any): Observable<any> {
		return this.api.get(this.apiController + `class/${id}`);
	}

	public save(data: any) {
		return this.api.post(this.apiController + 'class/save', data);
	}

	public UpdateClassCompany(data: any) {
		return this.api.post(this.apiController + 'add_company', data);
	}

	public AddClassProviderConfiglist(data: any) {
		return this.api.post(this.apiController + 'add_staff', data);
	}

	public classArchive(data: any) {
		return this.api.post(this.apiController + 'delete_company', data);
	}
}
