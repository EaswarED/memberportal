import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { ApptConfigService } from 'src/app/@core/backend/services/admin/appointment.service';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { DataGridNameComponent } from '../../../../@shared/components/data-grid/name/data-grid-name.component';
import { BooleanFlagPipe } from 'src/app/@shared/pipes/boolean-flag.pipe';
import { Logger } from 'src/app/@shared/utils/logger';

@Component({
	selector: 'mw-admin-appointment-list',
	templateUrl: './appointment-list.component.html',
	styleUrls: ['./appointment-list.component.scss'],
	providers: [BooleanFlagPipe]
})
export class ApppointmentListComponent implements OnInit {
	gridData$: Observable<any>;

	frameworkComponents = {
		gridActions: DataGridActionsComponent,
		gridName: DataGridNameComponent
	};
	columnDefs: ColDef[] = [
		{
			headerName: 'Name',
			field: 'SessionName',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'Category',
			field: 'CategoryName',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'Published',
			field: 'Details.IsPublished',
			valueFormatter: (params) =>
				this.booleanFlagPipe.transform(params.value)
		},
		{
			headerName: 'Global Access',
			field: 'Access.GlobalIn',
			valueFormatter: (params) =>
				this.booleanFlagPipe.transform(params.value)
		},
		{
			headerName: 'Globally Promoted',
			field: 'Promotion.GlobalIn',
			valueFormatter: (params) =>
				this.booleanFlagPipe.transform(params.value)
		},
		{
			field: 'SK',
			hide: true
		},
		{
			field: 'SessionTypeId',
			hide: true
		},
		{
			headerName: 'Action',
			cellRenderer: 'gridActions',
			minWidth: 150,
			maxWidth: 150
		}
	];

	defaultColDef: any = {
		sortable: true,
		resizable: true
	};

	gridContext: any;
	gridScope = this;

	constructor(
		private router: Router,
		private apptConfigService: ApptConfigService,
		private booleanFlagPipe: BooleanFlagPipe
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope
		};
	}

	receiveAction(actionObj: { action: string; data: [] }) {
		this.gridScope.onBtnClicked(actionObj.data);
	}

	onBtnClicked(item: any) {
		Logger.log(item);
		const stateData = {
			state: {
				data: {
					item: item
				}
			}
		};
		this.router.navigate(['modules/admin/appointment'], stateData);
	}

	ngOnInit(): void {
		this.gridData$ = this.apptConfigService.getList();
	}

	onBackAction() {
		this.router.navigate(['modules/admin']);
	}
}
