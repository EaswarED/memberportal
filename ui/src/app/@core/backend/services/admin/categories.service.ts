import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesApi } from '../../api/admin/categories.api';

@Injectable()
export class CategoriesService {
	constructor(private api: CategoriesApi) {}

	getList(type?: string): Observable<any> {
		return this.api.getList(type);
	}

	get(id: any): Observable<any> {
		return this.api.get(id);
	}

	save(data: any): Observable<any> {
		return this.api.save(data);
	}

	archive(data: any): Observable<any> {
		return this.api.archive(data);
	}

	type(type: any): Observable<any> {
		return this.api.type(type);
	}
}
