import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { ProviderConfigService } from 'src/app/@core/backend/services/admin/providers.service';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { DataGridNameComponent } from 'src/app/@shared/components/data-grid/name/data-grid-name.component';
import { Constants } from 'src/app/@shared/utils/constants';

@Component({
	selector: 'mw-provider-list',
	templateUrl: './provider-list.component.html',
	styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit {
	gridData$: Observable<any>;

	columnDefs: ColDef[] = [
		{
			headerName: 'Name',
			field: 'Name',
			cellRenderer: 'gridName',
			maxWidth: 300
		},
		{
			headerName: 'Description',
			field: 'Bio'
		},
		{
			headerName: 'ID',
			field: 'Id',
			hide: true
		},
		{
			headerName: 'Action',
			cellRenderer: 'gridActions',
			minWidth: 150,
			maxWidth: 150
		}
	];
	paginationPageSize: any = Constants.DEFAULT_GRID_PAGE_SIZE;
	frameworkComponents = {
		gridActions: DataGridActionsComponent,
		gridName: DataGridNameComponent
	};
	gridContext: any;
	gridScope = this;

	constructor(
		private router: Router,
		private staffService: ProviderConfigService
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope
		};
	}
	ngOnInit(): void {
		this.load_data();
	}
	load_data() {
		this.gridData$ = this.staffService.getProviderConfiglist();
	}
	receiveAction(actionObj: { action: string; data: {} }) {
		this.gridScope.showDetail(actionObj.data);
	}
	showDetail(item: any) {
		const stateData = {
			state: {
				data: {
					item: item
				}
			}
		};
		this.router.navigate(['modules/admin/provider'], stateData);
	}

	goBack() {
		this.router.navigate(['modules/admin']);
	}
}
