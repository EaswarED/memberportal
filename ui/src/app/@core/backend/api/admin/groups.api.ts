import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class GroupConfigApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public getList() {
		return this.api.get(this.apiController + 'groups');
	}

	public get(id: any): Observable<any> {
		return this.api.get(this.apiController + `group/${id}`);
	}

	public save(data: any) {
		return this.api.post(this.apiController + 'group/save', data);
	}

	public UpdateGroupCompany(data: any) {
		return this.api.post(this.apiController + 'add_company', data);
	}
	public AddGroupStaff(data: any) {
		return this.api.post(this.apiController + 'add_staff', data);
	}
	public StaffArchive(data: any) {
		return this.api.post(this.apiController + 'remove_staff', data);
	}

	public groupCompanyArchive(data: any) {
		return this.api.post(this.apiController + 'delete_company/', data);
	}

	public pendingList(id: any): Observable<any> {
		return this.api.get(this.apiController + `pending/${id}`);
	}

	public approvedList(id: any): Observable<any> {
		return this.api.get(this.apiController + `approved/${id}`);
	}

	public deniedList(id: any): Observable<any> {
		return this.api.get(this.apiController + `denied/${id}`);
	}
	public process(data: any): Observable<any> {
		return this.api.post(this.apiController + 'process', data);
	}

	public deny(data: any): Observable<any> {
		return this.api.post(this.apiController + 'deny', data);
	}
}
