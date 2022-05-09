import { Component, Inject, OnInit } from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Constants } from '../../utils/constants';
import { ClassTypeLabelPipe } from '../../pipes/classType-label.pipe';
import { Logger } from '../../utils/logger';
@Component({
	selector: 'mw-dialog-overview',
	templateUrl: './dialog-overview.component.html',
	styleUrls: ['./dialog-overview.component.scss'],
	providers: [ClassTypeLabelPipe]
})
export class DialogOverviewComponent implements OnInit {
	data: any;
	classType: string;
	dialogAction: string;

	CONST = Constants;

	constructor(
		public dialogRef: MatDialogRef<DialogOverviewComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any,
		public dialog: MatDialog,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loadData();
	}

	private loadData(): void {
		this.dialogAction = this.dialogData.action;
		this.classType = this.dialogData.data.type;
	}

	handleNo(): void {
		this.dialogRef.close();
	}

	handleYes(): void {
		const data: any = {
			state: {
				data: this.dialogData.data
			}
		};

		let url;
		if (this.classType == Constants.CLASS_TYPE_APPOINTMENT) {
			url = '/modules/appt/cancel';
		} else if (this.classType == Constants.CLASS_TYPE_CLASS) {
			url = '/modules/class/cancel';
		} else {
			url = '/modules/groups/cancel';
		}
		this.router.navigate([url], data);
	}
}
