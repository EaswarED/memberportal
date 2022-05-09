import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PromotionApi } from '../../api/admin/promotion.api';
@Injectable()
export class PromotionService {
	constructor(private api: PromotionApi) {}

	getList(classPath: string): Observable<any> {
		return this.api.getList(classPath);
	}

	add(data: any): Observable<any> {
		return this.api.add(data);
	}

	update(data: any): Observable<any> {
		return this.api.update(data);
	}

	getCompanyList(data: any): Observable<any> {
		return this.api.getCompanyList(data);
	}

	getClientList(data: any): Observable<any> {
		return this.api.getClientList(data);
	}

	public archive(data: any): Observable<any> {
		return this.api.archive(data);
	}
}
