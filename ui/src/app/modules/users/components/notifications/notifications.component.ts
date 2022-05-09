import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { NotificationService } from 'src/app/@core/backend/services/users/notification.service';

import { Logger } from 'src/app/@shared/utils/logger';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from 'src/app/modules/actions/message/message.component';
import { DataGridDateComponent } from 'src/app/@shared/components/data-grid/date/data-grid-date.component';

@Component({
	selector: 'mw-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
	notificationList: any;
	columnDefs: ColDef[] = [
		{
			headerName: 'From',
			field: 'fullname'
		},
		{
			headerName: 'Message',
			field: 'subject'
		},
		{
			headerName: 'Date',
			field: 'created_at',
			cellRenderer: 'gridDate'
		}
	];
	codeN: string;

	paginationPageSize: any = 5;
	defaultColDef: any = {
		sortable: true,
		resizable: true
	};
	context_data: any;

	gridNotActions = this;

	sortModel: any = [{ colId: 'received_at', sort: 'desc' }];
	constructor(
		private notificationService: NotificationService,
		public dialog: MatDialog
	) {
		this.context_data = {
			receiveAction: this.receiveAction,
			gridActions: this.gridNotActions
		};
	}
	frameworkComponents = {
		gridActions: DataGridActionsComponent,
		gridDate: DataGridDateComponent
	};
	ngOnInit(): void {
		this.load_data();
	}
	load_data(): void {
		this.notificationService.GetNotificationDetails().subscribe((data) => {
			Logger.debug(data);
			this.notificationList = data;
		});
	}
	onRowSelected(event: any) {
		const dialogRef = this.dialog.open(MessageComponent, {
			width: '500px',
			autoFocus: false,
			panelClass: 'mw-class-section',
			data: { item: event.data }
		});
	}
	receiveAction(actionObj: { action: string; data: [] }) {
		Logger.debug(actionObj.data);
	}
}
