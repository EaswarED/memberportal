import { Injectable } from '@angular/core';
import { StripeApi } from '../../api/stripe/stripe.api';

@Injectable()
export class StripeService {
	constructor(private api: StripeApi) {}

	payment(data: any) {
		return this.api.payment(data);
	}

	process(data: any) {
		return this.api.process(data);
	}
}
