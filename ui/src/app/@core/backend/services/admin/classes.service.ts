import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassConfigApi } from '../../api/admin/classes.api';

@Injectable()
export class ClassConfigService {
	constructor(private api: ClassConfigApi) {}

	getlist() {
		return this.api.getlist();
	}

	get(id: any): Observable<any> {
		return this.api.get(id);
	}

	save(data: any) {
		return this.api.save(data);
	}

	UpdateClassCompany(data: any) {
		return this.api.UpdateClassCompany(data);
	}

	AddClassProviderConfiglist(data: any) {
		return this.api.AddClassProviderConfiglist(data);
	}

	classArchive(data: any) {
		return this.api.classArchive(data);
	}
}
