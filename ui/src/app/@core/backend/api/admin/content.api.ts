import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class ContentApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public getList() {
		return this.api.get(this.apiController + 'contents');
	}

	public get(id: any): Observable<any> {
		return this.api.get(this.apiController + `content/${id}`);
	}

	public save(data: any) {
		return this.api.post(this.apiController + 'content/save', data);
	}

	public ContentArchive(data: any) {
		return this.api.post(this.apiController + 'delete_company', data);
	}

	public AddContentCompanyList(data: any) {
		return this.api.post(this.apiController + 'add_company', data);
	}

	public AddContentStaff(data: any) {
		return this.api.post(this.apiController + 'add_staff', data);
	}

	public StaffArchive(data: any) {
		return this.api.post(this.apiController + 'remove_staff', data);
	}
	public uploadContent(data: any) {
		return this.api.post(this.apiController + 'content/upload', data);
	}
	public readContent(id: any) {
		return this.api.get(this.apiController + `content/read/${id}`);
	}
}
