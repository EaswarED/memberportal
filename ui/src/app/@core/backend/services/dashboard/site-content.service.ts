import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SiteContentApi } from '../../api/dashboard/site-content.api';

@Injectable()
export class SiteContentSerice {
	constructor(private api: SiteContentApi) {}

	getSelfcareVimeoList() {
		return this.api.getSelfcareVimeoList();
	}
}
