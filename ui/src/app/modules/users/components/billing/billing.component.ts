import { Component } from '@angular/core';
import { HEADER_BILLING, HEADER_BILLING_UNUSED } from 'src/assets/mock-data';
import { ColDef } from 'ag-grid-community';
import { FormControl } from '@angular/forms';
import { Logger } from 'src/app/@shared/utils/logger';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';

@Component({
	selector: 'mw-billing',
	templateUrl: './billing.component.html',
	styleUrls: ['./billing.component.scss']
})
export class BillingComponent {
	apptBilling = HEADER_BILLING;
	HeaderUNUSED = HEADER_BILLING_UNUSED.title;
	apptBillingUnused = HEADER_BILLING_UNUSED.item;
	apptBillingColumnDefs: ColDef[] = [
		{
			headerName: 'Invoice#',
			field: 'invoice',
			minWidth: 220
		},
		{
			headerName: 'Purchase Date',
			field: 'purchasedate',
			minWidth: 220
		},
		{
			headerName: 'Service Type',
			field: 'servicetype',
			minWidth: 220
		},
		{
			headerName: 'Quantity',
			field: 'quantity',
			minWidth: 220
		},
		{
			headerName: 'Funding Source',
			field: 'fundingsource',
			minWidth: 220
		},
		{
			headerName: 'Total',
			field: 'total',
			minWidth: 220
		},
		{
			headerName: 'Action',
			field: 'action',
			cellRenderer: 'gridActions',
			minWidth: 220
		}
	];
	apptBillingUnusedColumnDefs: ColDef[] = [
		{
			headerName: 'Purchase Date',
			field: 'purchasedate',
			minWidth: 220
		},
		{
			headerName: 'Service Type',
			field: 'servicetype',
			minWidth: 220
		},
		{
			headerName: 'Quantity Purchased',
			field: 'quantitypurchased',
			minWidth: 220
		},
		{
			headerName: 'Quantity Scheduled',
			field: 'quantityscheduled',
			minWidth: 220
		},
		{
			headerName: 'Quantity Unscheduled',
			field: 'quantityunscheduled',
			minWidth: 220
		},
		{
			headerName: 'Expiry Date',
			field: 'expirydate',
			minWidth: 220
		}
	];
	date = new FormControl(new Date());
	serializedDate = new FormControl(new Date().toISOString());
	frameworkComponents = {
		gridActions: DataGridActionsComponent
	};

	context_data_hb: any;
	context_data_hbu: any;
	gridNotActions = this;
	sortModel: any = [{ colId: 'received_at', sort: 'desc' }];
	paginationPageSize: any = 5;
	defaultColDef: any = {
		sortable: true,
		resizable: true
	};
	constructor() {
		this.context_data_hb = {
			receiveAction: this.receiveActionHB,
			gridActions: this.gridNotActions,
			code: 'HB'
		};

		this.context_data_hbu = {
			receiveAction: this.receiveActionHBU,
			gridActions: this.gridNotActions,
			code: 'HBU'
		};
	}

	receiveActionHB(actionObj: { action: string; data: [] }) {
		Logger.debug(actionObj.data);
	}

	receiveActionHBU(actionObj: { action: string; data: [] }) {
		Logger.debug(actionObj.data);
	}
}
