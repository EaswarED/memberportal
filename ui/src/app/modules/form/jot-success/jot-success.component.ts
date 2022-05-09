import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ChronoFormService } from 'src/app/@core/backend/services/form/chrono-form.service';
import { StripeService } from 'src/app/@core/backend/services/stripe/stripe.service';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';

@Component({
	selector: 'mw-jot-success',
	templateUrl: './jot-success.component.html',
	styleUrls: ['./jot-success.component.scss']
})
export class JotSuccessComponent implements OnInit {
	private alive = true;
	isLoading: boolean = true;
	success: any;
	failed: any;
	bookingId: any;
	type: any;
	visitType: any;
	id: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private chronoFormService: ChronoFormService,
		private uiMessagingService: UiMessagingService
	) {}

	ngOnInit(): void {
		const clientId = this.route.snapshot.paramMap.get('clientId');
		const formId = this.route.snapshot.paramMap.get('formId');
		const submissionId = this.route.snapshot.paramMap.get('submissionId');
		this.id = this.route.snapshot.paramMap.get('id');
		this.route.queryParams.subscribe((params) => {
			this.bookingId = params.visitId;
			this.visitType = params.visitType;
			this.type = params.type;
		});
		const payload = {
			clientId: Number(clientId),
			formId: formId,
			submissionId: Number(submissionId)
		};

		this.chronoFormService
			.save(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (data) {
					this.isLoading = false;
					this.uiMessagingService.showSuccess(
						'Submission is successfully!'
					);
					// this.router.navigate(['/modules/checkin']);
				}
			});
	}
	goChecckIn() {
		const stateData = {
			state: {
				data: {
					classType: this.type,
					data: {
						VisitType: this.visitType,
						VisitId: this.bookingId,
						SubmitValue: 1
					}
				}
			}
		};
		this.router.navigate(['/modules/checkin'], stateData);
	}
}
