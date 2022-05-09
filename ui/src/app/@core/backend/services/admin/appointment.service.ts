import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApptConfigApi } from '../../api/admin/appointment.api';

@Injectable()
export class ApptConfigService {
	constructor(private api: ApptConfigApi) {}

	getList() {
		return this.api.getList();
	}

	get(id: any): Observable<any> {
		return this.api.get(id);
	}

	save(data: any) {
		return this.api.save(data);
	}

	AddApptProviderConfiglist(data: any) {
		return this.api.AddApptProviderConfiglist(data);
	}

	UpdateApptCompany(data: any) {
		return this.api.UpdateApptCompany(data);
	}

	classArchive(data: any) {
		return this.api.classArchive(data);
	}
}
