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
import { ClassConfigService } from 'src/app/@core/backend/services/admin/classes.service';
@Component({
	selector: 'mw-dialog-confirm',
	templateUrl: './dialog-confirm.component.html',
	styleUrls: ['./dialog-confirm.component.scss'],
	providers: [ClassTypeLabelPipe]
})
export class DialogConfirmComponent implements OnInit {
	data: any;
	type: string;
	dialogAction: string;

	CONST = Constants;

	constructor(
		public dialogRef: MatDialogRef<DialogConfirmComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any,
		public dialog: MatDialog,
		private router: Router,
		private classConfigService: ClassConfigService
	) {}

	ngOnInit(): void {
		this.loadData();
	}

	private loadData(): void {
		// this.dialogAction = this.dialogData.action;
		this.type = this.dialogData.type;
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

		//else if (this.classType == Constants.CLASS_TYPE_CLASS) {
		// 	url = '/class/cancel';
		// } else {
		// 	url = '/groups/cancel';
		// }
	}
}
