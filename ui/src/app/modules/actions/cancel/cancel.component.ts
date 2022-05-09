import { Component, Inject, OnInit } from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ApptCancelService } from 'src/app/@core/backend/services/appointment/appt-cancel.service';
import { ClassTypeLabelPipe } from 'src/app/@shared/pipes/classType-label.pipe';
import { Constants } from 'src/app/@shared/utils/constants';
@Component({
	selector: 'mw-cancel',
	templateUrl: './cancel.component.html',
	styleUrls: ['./cancel.component.scss'],
	providers: [ClassTypeLabelPipe]
})
export class CancelComponent implements OnInit {
	classType: string;
	pageTitle: string;
	freebie: any;

	CONST = Constants;
	cancelData: any;
	alive: boolean = true;
	cancel_type: string = '';

	constructor(
		public dialogRef: MatDialogRef<CancelComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private router: Router,
		private classTypeLabelPipe: ClassTypeLabelPipe,
		public apptCancelService: ApptCancelService
	) {}

	ngOnInit(): void {
		this.loadData();
	}

	private loadData(): void {
		switch (this.data.type) {
			case Constants.CLASS_LABEL_APPOINTMENT:
				this.classType = Constants.CLASS_TYPE_APPOINTMENT;
				break;
			case Constants.CLASS_LABEL_CLASS:
				this.classType = Constants.CLASS_TYPE_CLASS;
				break;
			case Constants.CLASS_LABEL_GROUP:
				this.classType = Constants.CLASS_TYPE_GROUP;
				break;
			default:
				this.classType = this.data.type;
				break;
		}
		this.freebie = this.data.Freebie;
		this.cancel_type = this.data.cancel_type;
		this.pageTitle = this.classTypeLabelPipe.transform(this.classType);
	}

	handleNo(): void {
		this.dialogRef.close();
	}

	handleYes(): void {
		let url;
		if (this.classType == Constants.CLASS_TYPE_APPOINTMENT) {
			url = '/modules/appt/cancel';
		} else if (this.classType == Constants.CLASS_TYPE_CLASS) {
			url = '/modules/class/cancel';
		} else if (this.classType == Constants.CLASS_TYPE_GROUP) {
			url = '/modules/group/cancel';
		}
		const stateData = {
			state: {
				data: this.data
			}
		};
		this.router.navigate([url], stateData);
		// const data: any = {
		// 	state: {
		// 		data: this.data.BookingId
		// 	}
		// };
	}
}
