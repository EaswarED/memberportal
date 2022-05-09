import { DOCUMENT } from '@angular/common';
import {
	Component,
	HostListener,
	Inject,
	OnInit,
	Renderer2
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { OnlineFormService } from 'src/app/@core/backend/services/admin/form.service';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { DialogOverviewComponent } from 'src/app/@shared/components/dialog-overview/dialog-overview.component';
import { Logger } from 'src/app/@shared/utils/logger';
import { DataGridNameComponent } from '../../../../@shared/components/data-grid/name/data-grid-name.component';

@Component({
	selector: 'mw-non-clinical-fb-configuration',
	templateUrl: './non-clinical-fb-configuration.component.html',
	styleUrls: ['./non-clinical-fb-configuration.component.scss']
})
export class NonClinicalFBConfigurationComponent implements OnInit {
	frameworkComponents = {
		gridActions: DataGridActionsComponent,
		gridName: DataGridNameComponent
	};
	columnDefs: ColDef[] = [
		{
			headerName: 'Name',
			field: 'title',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'URL',
			field: 'url'
		},
		{
			headerName: 'Status',
			field: 'status'
		},
		{
			headerName: 'ID',
			field: 'id',
			hide: true
		},
		{
			headerName: 'Action',
			cellRenderer: 'gridActions',
			minWidth: 150
		}
	];
	paginationPageSize: any = 5;
	defaultColDef: any = {
		sortable: true,
		resizable: true
	};

	sortModel: any = [{ colId: 'title', sort: 'desc' }];
	gridApptActions = this;
	tableData: any;
	context_data: any;
	urlSafe: any;
	constructor(
		private router: Router,
		private onlineFormService: OnlineFormService,
		public sanitizer: DomSanitizer,
		private renderer2: Renderer2,
		@Inject(DOCUMENT) private _document: any,

		private dialog: MatDialog
	) {
		this.context_data = {
			receiveAction: this.receiveAction,
			gridActions: this.gridApptActions,
			code: 'OFB'
		};
	}
	ngOnInit(): void {
		this.load_data();
	}
	load_data(): void {
		this.onlineFormService.getNonClinicalForms().subscribe((data: any) => {
			Logger.debug(data);
			this.tableData = data;
			this.tableData.forEach((element: any) => {
				this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
					element.url
				);
			});
		});
	}
	receiveAction(actionObj: { action: string; data: [] }) {
		Logger.debug(actionObj.data);
	}
	onAddConfiguration(e: any, name: any) {
		if (name == 'New Patient') {
			// this.router.navigate(['admin/nonclinical-one/' + e]);
			const dialogRef = this.dialog.open(DialogOverviewComponent, {
				width: '100%',
				autoFocus: false,
				panelClass: 'mw-appt-section',
				data: { name: 'NCF', type: e }
			});

			dialogRef.afterClosed().subscribe((result) => {
				Logger.debug('The dialog was closed');
			});
		} else {
			// window.open('https://form.jotform.com/' + e, '_blank');
			window.open(
				'https://form.jotform.com/' + e,
				'_blank',
				'directories=no,titlebar=no,toolbar=no,location=yes,menubar=no,height=570,width=720,scrollbars=yes,status=yes'
			);
		}
	}
	onBackAction() {
		this.router.navigate(['modules/admin']);
	}
}
