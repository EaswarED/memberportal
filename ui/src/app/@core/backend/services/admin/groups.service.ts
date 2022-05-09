import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupConfigApi } from '../../api/admin/groups.api';

@Injectable()
export class GroupConfigService {
	constructor(private api: GroupConfigApi) {}

	getList() {
		return this.api.getList();
	}

	get(id: any): Observable<any> {
		return this.api.get(id);
	}

	save(data: any) {
		return this.api.save(data);
	}

	UpdateGroupCompany(data: any) {
		return this.api.UpdateGroupCompany(data);
	}
	AddGroupStaff(data: any) {
		return this.api.AddGroupStaff(data);
	}

	StaffArchive(data: any) {
		return this.api.StaffArchive(data);
	}

	groupCompanyArchive(data: any) {
		return this.api.groupCompanyArchive(data);
	}
	pendingList(id: any): Observable<any> {
		return this.api.pendingList(id);
	}

	process(data: any): Observable<any> {
		return this.api.process(data);
	}

	deny(data: any): Observable<any> {
		return this.api.deny(data);
	}

	approvedList(id: any): Observable<any> {
		return this.api.approvedList(id);
	}

	deniedList(id: any): Observable<any> {
		return this.api.deniedList(id);
	}
}
