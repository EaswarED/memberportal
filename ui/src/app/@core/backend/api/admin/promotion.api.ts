import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class PromotionApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public getList(classPath: string): Observable<any> {
		return this.api.get(this.apiController + `promotions/${classPath}`);
	}

	public add(data: any): Observable<any> {
		return this.api.post(this.apiController + 'promotion/add', data);
	}

	public update(data: any): Observable<any> {
		return this.api.post(this.apiController + 'promotion/update', data);
	}

	public getCompanyList(data: any): Observable<any> {
		return this.api.post(this.apiController + 'promo_company', data);
	}

	public getClientList(data: any): Observable<any> {
		return this.api.post(this.apiController + 'promo_client', data);
	}

	public archive(data: any): Observable<any> {
		return this.api.post(this.apiController + 'remove_promo', data);
	}
}
