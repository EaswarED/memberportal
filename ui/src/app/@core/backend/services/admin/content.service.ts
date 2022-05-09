import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentApi } from '../../api/admin/content.api';

@Injectable()
export class ContentService {
	constructor(private api: ContentApi) {}

	getList() {
		return this.api.getList();
	}

	get(id: any): Observable<any> {
		return this.api.get(id);
	}

	save(data: any) {
		return this.api.save(data);
	}

	AddContentCompanyList(data: any) {
		return this.api.AddContentCompanyList(data);
	}
	AddContentStaff(data: any) {
		return this.api.AddContentStaff(data);
	}

	ContentArchive(data: any) {
		return this.api.ContentArchive(data);
	}

	StaffArchive(data: any) {
		return this.api.StaffArchive(data);
	}

	uploadContent(data: any) {
		return this.api.uploadContent(data);
	}
	readContent(data: any) {
		return this.api.readContent(data);
	}
}
