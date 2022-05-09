import { Injectable } from '@angular/core';
import { ChronoFormApi } from '../../api/form/chrono-form.api';
@Injectable()
export class ChronoFormService {
	constructor(private api: ChronoFormApi) {}

	getList(url: any) {
		return this.api.getList(url);
	}

	get(id: any) {
		return this.api.get(id);
	}

	save(data: any) {
		return this.api.save(data);
	}
}
