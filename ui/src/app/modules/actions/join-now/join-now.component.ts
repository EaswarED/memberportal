import { Component, Inject, OnInit } from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { takeWhile } from 'rxjs/operators';
import { ApptJoinService } from 'src/app/@core/backend/services/appointment/appt-join.service';
import { ClassJoinService } from 'src/app/@core/backend/services/class/class-join.service';
import { Constants } from 'src/app/@shared/utils/constants';

@Component({
	selector: 'mw-join-now',
	templateUrl: './join-now.component.html',
	styleUrls: ['./join-now.component.scss']
})
export class JoinNowComponent implements OnInit {
	private alive: boolean = true;
	isLoading: boolean = true;
	url: any;
	error: any;

	constructor(
		public dialogRef: MatDialogRef<JoinNowComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any,
		public dialog: MatDialog,
		private apptJoinService: ApptJoinService,
		private classJoinService: ClassJoinService
	) {}

	ngOnInit(): void {
		this.loadData();
	}
	private loadData() {
		const classType = this.dialogData.Type
			? this.dialogData.Type
			: this.dialogData.classType;
		if (
			classType == Constants.CLASS_LABEL_APPOINTMENT ||
			classType == Constants.CLASS_TYPE_APPOINTMENT
		) {
			const BookingId = this.dialogData.BookingId
				? this.dialogData.BookingId
				: this.dialogData.data.BookingId;
			this.apptJoinService
				.apptJoin(BookingId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((item) => {
					this.isLoading = false;
					this.populateForm(item);
				});
		} else {
			const visitId = this.dialogData.VisitId
				? this.dialogData.VisitId
				: this.dialogData.data.VisitId;
			this.classJoinService
				.classJoin(visitId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((item) => {
					this.isLoading = false;
					this.populateForm(item);
				});
		}
	}

	handleClose(): void {
		this.dialogRef.close();
	}
	populateForm(data: any) {
		this.url = data.Url;
	}
}
