import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class CreateBookConsultClassApi {
	private readonly apiController: string = 'class/';

	constructor(private api: BaseApi) {}

	public AddBookConsultClass(data: any) {
		return this.api.post(this.apiController + 'classes/add_class', data);
	}
}
