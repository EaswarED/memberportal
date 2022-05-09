import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompaniesApi } from '../../api/admin/company.api';

@Injectable()
export class CompaniesService {
	constructor(private api: CompaniesApi) {}

	getList(): Observable<any> {
		return this.api.getList();
	}

	getSelectedList(): Observable<any> {
		return this.api.getSelectedList();
	}

	get(id: any): Observable<any> {
		return this.api.get(id);
	}

	save(data: any): Observable<any> {
		return this.api.save(data);
	}
}
