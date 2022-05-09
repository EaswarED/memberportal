import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/base.api';

@Injectable()
export class VimeoItemApi {
	private readonly apiController: string = 'selfcare/';

	constructor(private api: BaseApi) {}

	getCategoryVimeoList() {
		return this.api.get(this.apiController + 'categories');
	}
	getTypeVimeoList() {
		return this.api.get(this.apiController + 'type');
	}
	getVideoVimeoList() {
		return this.api.get(this.apiController + 'video_list');
	}
	getContentTypeVimeoList() {
		return this.api.get(this.apiController + 'content_type');
	}
	getRelatedVideoVimeoList() {
		return this.api.get(this.apiController + 'related_video');
	}
	getLikesVimeoList() {
		return this.api.get(this.apiController + 'specific_video');
	}

	public get(id: any): Observable<any> {
		return this.api.get(this.apiController + `content/${id}`);
	}

	public save(data: any) {
		return this.api.post(this.apiController + 'save', data);
	}
}
