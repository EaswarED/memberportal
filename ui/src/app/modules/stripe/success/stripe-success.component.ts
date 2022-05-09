import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { StripeService } from 'src/app/@core/backend/services/stripe/stripe.service';
import { AppStore } from 'src/app/@shared/datastores/app-store';

@Component({
	selector: 'mw-stripe-success',
	templateUrl: './stripe-success.component.html',
	styleUrls: ['./stripe-success.component.scss']
})
export class StripeSuccessComponent implements OnInit {
	private alive = true;
	isLoading: boolean = true;
	success: any;
	failed: any;

	constructor(
		private route: ActivatedRoute,
		private stripeService: StripeService,
		private appStore: AppStore
	) {}

	ngOnInit(): void {
		const routeParams = this.route.snapshot.paramMap.get('id');
		const payload = {
			sessionId: routeParams,
			clientId: this.appStore.getClientId()
		};
		this.stripeService
			.process(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (!data.Error) {
					this.success = data;
				} else {
					this.failed = data.Error['Message'];
				}
				this.isLoading = false;
			});
	}
}
