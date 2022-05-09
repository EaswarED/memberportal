import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class OnlineFormApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public getClinicalForms(): Observable<any> {
		return this.api.get(this.apiController + 'forms/c');
	}

	public getNonClinicalForms(): Observable<any> {
		return this.api.get(this.apiController + 'forms/n');
	}

	public getList(type: any): Observable<any> {
		return this.api.get(this.apiController + `forms/${type}`);
	}

	public getClinicalForm(id: string): Observable<any> {
		return this.api.get(this.apiController + `cform/${id}`);
	}

	public getNonClinicalForm(id: string): Observable<any> {
		return this.api.get(this.apiController + `nform/${id}`);
	}

	public saveForm(data: any): Observable<any> {
		return this.api.post(this.apiController + 'form/save', data);
	}
}
