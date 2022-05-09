import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Constants } from '../../utils/constants';
import { Logger } from 'src/app/@shared/utils/logger';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'mw-dialog-payment',
	templateUrl: './dialog-payment.component.html',
	styleUrls: ['./dialog-payment.component.scss']
})
export class DialogPaymentComponent implements OnInit {
	urlLink: any;
	stripe: any = null;
	CONST = Constants;

	constructor(
		public dialogRef: MatDialogRef<DialogPaymentComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any,
		public dialog: MatDialog,
		private http: HttpClient
	) {}

	ngOnInit(): void {
		// this.http.post('http://localhost:4242/checkoutPayment', this.dialogData).subscribe((res: any) => {
		// 	if (res) {
		// 		window.location.href = res['url'];
		// 	}
		// });
		const stripePromise = loadStripe(environment.stripeKey).then(
			async (res) => {
				this.stripe = res;
				const stripeData = {
					lineItems: [
						{
							price: 'price_1KWQeNSCEsFbFVUYN7WVO0Hi',
							quantity: 5
						}
					],
					mode: 'payment',
					successUrl: `${window.location.href}/success`,
					cancelUrl: `${window.location.href}/failure`
				};

				const { error } = await this.stripe.redirectToCheckout(
					stripeData
				);

				if (error) {
					Logger.log(error);
				}
			}
		);
	}
}
