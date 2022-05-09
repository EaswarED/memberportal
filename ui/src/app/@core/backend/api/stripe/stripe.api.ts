import { Injectable } from '@angular/core';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class StripeApi {
	private readonly apiController: string = 'stripe/';

	constructor(private api: BaseApi) {}

	public payment(data: any) {
		return this.api.post(this.apiController + 'request/', data);
	}

	public process(data: any) {
		return this.api.post(this.apiController + 'process/', data);
	}
}
