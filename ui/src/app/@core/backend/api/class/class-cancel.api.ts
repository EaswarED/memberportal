import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class ClassCancelApi {
	private readonly apiController: string = 'class/';

	constructor(private api: BaseApi) {}

	public AddClassCancel(bookingId: number) {
		return this.api.get(this.apiController + `cancel/${bookingId}`);
	}
}
