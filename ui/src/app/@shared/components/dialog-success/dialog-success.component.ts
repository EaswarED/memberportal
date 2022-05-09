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
	selector: 'mw-dialog-success',
	templateUrl: './dialog-success.component.html',
	styleUrls: ['./dialog-success.component.scss'],
	providers: [ClassTypeLabelPipe]
})
export class DialogSuccessComponent implements OnInit {
	data: any;
	name: string;
	type: string;
	dialogAction: string;

	CONST = Constants;

	constructor(
		public dialogRef: MatDialogRef<DialogSuccessComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.loadData();
	}

	private loadData(): void {
		this.name = this.dialogData.name;
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
	}
}
