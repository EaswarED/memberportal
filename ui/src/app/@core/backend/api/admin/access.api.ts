import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class AccessApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public getList(classPath: string): Observable<any> {
		return this.api.get(this.apiController + `access/${classPath}`);
	}

	public add(data: any): Observable<any> {
		return this.api.post(this.apiController + 'access/add', data);
	}

	public update(data: any): Observable<any> {
		return this.api.post(this.apiController + 'access/update', data);
	}

	public getCompanyList(data: any): Observable<any> {
		return this.api.post(this.apiController + 'access_company', data);
	}

	public getClientList(data: any): Observable<any> {
		return this.api.post(this.apiController + 'access_client', data);
	}

	public archive(data: any): Observable<any> {
		return this.api.post(this.apiController + 'remove_access', data);
	}
}
