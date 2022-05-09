import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ApptCancelService } from 'src/app/@core/backend/services/appointment/appt-cancel.service';
import { ClassCancelService } from 'src/app/@core/backend/services/class/class-cancel.service';
import { ClassTypeLabelPipe } from 'src/app/@shared/pipes/classType-label.pipe';
import { Constants } from 'src/app/@shared/utils/constants';
import { Logger } from 'src/app/@shared/utils/logger';

@Component({
	selector: 'mw-cancel-summary',
	templateUrl: './cancel-summary.component.html',
	styleUrls: ['./cancel-summary.component.scss'],
	providers: [ClassTypeLabelPipe]
})
export class CancelSummaryComponent implements OnInit, OnDestroy {
	private alive: boolean = true;
	isLoading: boolean = true;
	bookingId: any;
	cancelstate: string;
	classType: string;
	pageTitle: string;
	selectedSummary: any;
	freebie: any;
	freeClass: any;
	constructor(
		private router: Router,
		private classTypeLabelPipe: ClassTypeLabelPipe,
		private apptCancelService: ApptCancelService,
		private classCancelService: ClassCancelService
	) {}
	ngOnInit(): void {
		if (history.state.data) {
			this.bookingId = history.state.data.BookingId;
			this.classType = history.state.data.type;
			this.cancelstate = history.state.data.cancel_type;
			this.pageTitle = this.classTypeLabelPipe.transform(this.classType);

			this.apptCancelService
				.getSummaryCancel(this.bookingId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((data) => {
					this.isLoading = false;
					this.selectedSummary = data[0];
					this.freeClass = this.selectedSummary.classId;
					this.freebie = this.selectedSummary.Freebie;
				});
		}
	}
	cancel() {
		this.router.navigate(['/modules']);
	}
	handleNo() {
		switch (this.classType) {
			case Constants.CLASS_TYPE_APPOINTMENT:
				this.router.navigate(['/modules/appt']);
				break;
		}
	}

	handleYes() {
		this.isLoading = true;
		let url = '/modules/appt';
		switch (this.classType) {
			case Constants.CLASS_TYPE_CLASS:
				url = '/modules/class';
				break;
			case Constants.CLASS_LABEL_CLASS:
				url = '/modules/class';
				break;
			case Constants.CLASS_TYPE_GROUP:
				url = '/modules/group';
				break;
		}

		if (
			this.classType == Constants.CLASS_TYPE_APPOINTMENT ||
			this.classType == Constants.CLASS_LABEL_APPOINTMENT
		) {
			this.apptCancelService
				.AddApptCancel(this.bookingId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((data) => {
					this.isLoading = false;
					this.router.navigate([url]).then();
				});
		} else {
			this.classCancelService
				.AddClassCancel(this.bookingId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((data) => {
					this.isLoading = false;
					this.router.navigate([url]).then();
				});
		}
	}

	ngOnDestroy() {
		this.alive = false;
	}
}
