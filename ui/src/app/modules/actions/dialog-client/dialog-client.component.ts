import { Component, Inject, OnInit } from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Constants } from '../../../@shared/utils/constants';
import { ClassTypeLabelPipe } from '../../../@shared/pipes/classType-label.pipe';
import { Logger } from '../../../@shared/utils/logger';
import { ColDef } from 'ag-grid-community';
import { Observable, of } from 'rxjs';
import { DataGridActionsComponent } from '../../../@shared/components/data-grid-actions/data-grid-actions.component';
import { DataGridNameComponent } from '../../../@shared/components/data-grid/name/data-grid-name.component';
import { AccessService } from 'src/app/@core/backend/services/admin/access.service';
import { PromotionService } from 'src/app/@core/backend/services/admin/promotion.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'mw-dialog-client',
	templateUrl: './dialog-client.component.html',
	styleUrls: ['./dialog-client.component.scss'],
	providers: [ClassTypeLabelPipe]
})
export class DialogClientComponent implements OnInit {
	private classType: string = Constants.CLASS_TYPE_APPOINTMENT;
	isLoading: boolean = false;

	gridData: any;
	service: any;
	private alive: boolean = true;

	CONST = Constants;

	columnDefs: ColDef[] = [
		{
			headerName: 'Client Name',
			field: 'FirstName',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'Website',
			field: 'Email'
		},
		{
			headerName: 'ID',
			field: 'Id',
			hide: true
		},
		{
			headerName: 'Action',
			cellRenderer: 'gridActions',
			maxWidth: 150
		}
	];

	frameworkComponents = {
		gridActions: DataGridActionsComponent,
		gridName: DataGridNameComponent
	};
	gridContext: any;
	gridScope = this;

	actionList = [
		{
			icon: 'close',
			tip: 'Close',
			action: 'close'
		}
	];
	getActions(): any[] {
		return this.gridScope.actionList;
	}

	constructor(
		public dialogRef: MatDialogRef<DialogClientComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any,
		public dialog: MatDialog,
		private accessService: AccessService,
		private promotionService: PromotionService,
		private uiMessagingService: UiMessagingService
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope,
			getActions: this.getActions
		};
	}

	receiveAction(actionObj: { action: string; data: any }) {
		this.gridScope.handleDelete(actionObj.data.Id);
	}

	ngOnInit(): void {
		this.loadData();
	}

	private loadData(): void {
		this.gridData = this.dialogData.item;
	}

	handleClose(): void {
		this.dialogRef.close();
	}

	handleDelete(id: any): void {
		this.isLoading = true;
		const delPayload = {
			classId: this.dialogData.detail.classId,
			selectedId: String(id),
			classType: this.dialogData.detail.classType,
			promotionType: this.dialogData.detail.promotionType
		};
		if (
			this.dialogData.detail.type === Constants.PROMOTION_TYPE_PROMOTION
		) {
			this.service = this.promotionService;
		} else if (
			this.dialogData.detail.type === Constants.PROMOTION_TYPE_ACCESS
		) {
			this.service = this.accessService;
		}
		this.service
			.archive(delPayload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((item: any) => {
				if (item) {
					this.isLoading = false;
					this.uiMessagingService.showSuccess('Deleted Successfully');
					this.dialogRef.close();
				}
			});
	}
}
