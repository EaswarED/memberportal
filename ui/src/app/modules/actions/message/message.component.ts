import { Component, Inject, OnInit } from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { ApptCancelService } from 'src/app/@core/backend/services/appointment/appt-cancel.service';
import { ClassTypeLabelPipe } from 'src/app/@shared/pipes/classType-label.pipe';
import { Constants } from 'src/app/@shared/utils/constants';
@Component({
	selector: 'mw-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss'],
	providers: [ClassTypeLabelPipe]
})
export class MessageComponent implements OnInit {
	classType: string;
	pageTitle: string;
	freebie: any;

	CONST = Constants;
	cancelData: any;
	alive: boolean = true;
	cancel_type: string = '';

	constructor(
		public dialogRef: MatDialogRef<MessageComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public apptCancelService: ApptCancelService
	) {}

	ngOnInit(): void {
		this.loadData();
	}

	private loadData(): void {}

	handleNo(): void {
		this.dialogRef.close();
	}
}
