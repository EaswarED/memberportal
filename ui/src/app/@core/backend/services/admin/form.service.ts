import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OnlineFormApi } from '../../api/admin/form.api';

@Injectable()
export class OnlineFormService {
	constructor(private api: OnlineFormApi) {}

	public getClinicalForms(): Observable<any> {
		return this.api.getClinicalForms();
	}

	public getNonClinicalForms(): Observable<any> {
		return this.api.getNonClinicalForms();
	}

	public getClinicalForm(id: string): Observable<any> {
		return this.api.getClinicalForm(id);
	}

	public getList(type: any): Observable<any> {
		return this.api.getList(type);
	}

	public getNonClinicalForm(id: string): Observable<any> {
		return this.api.getNonClinicalForm(id);
	}

	public saveForm(data: any): Observable<any> {
		return this.api.saveForm(data);
	}
}
