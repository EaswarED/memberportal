import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class CompaniesApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public getList(): Observable<any> {
		return this.api.get(this.apiController + 'company');
	}

	public getSelectedList(): Observable<any> {
		return this.api.get(this.apiController + 'select_company');
	}

	public get(id: any): Observable<any> {
		return this.api.get(this.apiController + `company/${id}`);
	}

	public save(data: any): Observable<any> {
		return this.api.post(this.apiController + 'company/save', data);
	}
}
