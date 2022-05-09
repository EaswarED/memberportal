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
import { DomSanitizer } from '@angular/platform-browser';
@Component({
	selector: 'mw-dialog-form',
	templateUrl: './dialog-form.component.html',
	styleUrls: ['./dialog-form.component.scss'],
	providers: [ClassTypeLabelPipe]
})
export class DialogFormComponent implements OnInit {
	urlLink: any;

	CONST = Constants;

	constructor(
		public dialogRef: MatDialogRef<DialogFormComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any,
		public dialog: MatDialog,
		public sanitizer: DomSanitizer
	) {}

	ngOnInit(): void {
		this.loadData();
	}

	private loadData(): void {
		this.urlLink = this.sanitizer.bypassSecurityTrustResourceUrl(
			this.dialogData.url +
				this.dialogData.id +
				'?clientId=' +
				this.dialogData.clientId +
				'&formId=' +
				this.dialogData.id +
				'&visitId=' +
				this.dialogData.visitId +
				'&type=' +
				this.dialogData.type +
				'&visitType=' +
				this.dialogData.visitType
		);
	}
}
