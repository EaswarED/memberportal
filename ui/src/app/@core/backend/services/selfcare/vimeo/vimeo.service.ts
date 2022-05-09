import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VimeoItemApi } from '../../../api/selfcare/vimeo/vimeo.api';
@Injectable()
export class VimeoItemService {
	constructor(private api: VimeoItemApi) {}

	getCategoryVimeoList() {
		return this.api.getCategoryVimeoList();
	}

	getTypeVimeoList() {
		return this.api.getTypeVimeoList();
	}

	getVideoVimeoList() {
		return this.api.getVideoVimeoList();
	}

	getRelatedVideoVimeoList() {
		return this.api.getRelatedVideoVimeoList();
	}

	getLikesVimeoList() {
		return this.api.getLikesVimeoList();
	}

	getContentTypeVimeoList() {
		return this.api.getContentTypeVimeoList();
	}

	get(id: any): Observable<any> {
		return this.api.get(id);
	}

	save(data: any) {
		return this.api.save(data);
	}
}
