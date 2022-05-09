import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Util } from 'src/app/@shared/utils/util';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class CategoriesApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public getList(type?: string): Observable<any> {
		let param = '';
		if (type) {
			param = Util.toLower(type);
		}
		return this.api.get(this.apiController + `categories/${param}`);
	}

	public get(id: any): Observable<any> {
		return this.api.get(this.apiController + `category/${id}`);
	}

	public save(data: any): Observable<any> {
		return this.api.post(this.apiController + 'category/save', data);
	}

	public archive(data: any): Observable<any> {
		return this.api.post(this.apiController + 'category/del', data);
	}

	public type(type: any): Observable<any> {
		return this.api.get(this.apiController + `categories/${type}`);
	}
}
