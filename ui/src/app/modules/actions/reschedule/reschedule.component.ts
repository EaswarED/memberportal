import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ApptCancelService } from 'src/app/@core/backend/services/appointment/appt-cancel.service';
import { DialogData } from 'src/app/@shared/interfaces/dialog-data.interface';
import { ClassTypeLabelPipe } from 'src/app/@shared/pipes/classType-label.pipe';
import { Constants } from 'src/app/@shared/utils/constants';
import { Logger } from 'src/app/@shared/utils/logger';

@Component({
	selector: 'mw-reschedule',
	templateUrl: './reschedule.component.html',
	styleUrls: ['./reschedule.component.scss'],
	providers: [ClassTypeLabelPipe]
})
export class ReScheduleComponent implements OnInit {
	classType: string;
	pageTitle: string;
	reschedule: any;
	bookingStatus: any;
	cancel_type: any;
	private alive = true;

	CONST = Constants;

	constructor(
		private router: Router,
		public dialogRef: MatDialogRef<ReScheduleComponent>,
		private classTypeLabelPipe: ClassTypeLabelPipe,
		private apptCancelService: ApptCancelService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {
		this.loadForm();
	}

	private loadForm() {
		// const classType = this.gridType ? this.gridType : this.data.Type;
		this.classType = this.data.classType;
		this.bookingStatus = this.data.bookingStatus;
		this.pageTitle = this.classTypeLabelPipe.transform(this.classType);
		this.cancel_type = this.data.grid_data.cancel_type;
	}

	handleNo() {
		this.dialogRef.close();
	}

	handleYes() {
		this.apptCancelService
			.getReschedule(this.data.grid_data.BookingId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.reschedule = data[0];
				const stateData = {
					state: {
						data: {
							bookingId: this.reschedule.bookingId,
							categoryId: this.reschedule.categoryId,
							sessionId: this.reschedule.sessionId,
							sessionName: this.reschedule.sessionname,
							staffId: this.reschedule.staffId
						}
					}
				};
				switch (this.classType) {
					case Constants.CLASS_TYPE_APPOINTMENT:
						this.router.navigate(
							['/modules/appt/create'],
							stateData
						);
						break;
					case Constants.CLASS_TYPE_CLASS:
						this.router.navigate(
							['/modules/class/create'],
							stateData
						);
						break;
					case Constants.CLASS_TYPE_GROUP:
						this.router.navigate(
							['/modules/group/create'],
							stateData
						);
						break;
				}
			});
	}
}
