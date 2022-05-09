import { Injectable } from '@angular/core';
import { BaseApi } from '../shared/base.api';
import { Observable } from 'rxjs';

@Injectable()
export class SiteContentApi {
	private readonly apiController: string = 'selfcare/';

	constructor(private api: BaseApi) {}

	getSelfcareVimeoList() {
		return this.api.get(this.apiController + 'video_list');
	}
}
