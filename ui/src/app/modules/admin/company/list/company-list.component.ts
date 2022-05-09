import { Component, OnInit } from '@angular/core';
import { DataGridNameComponent } from 'src/app/@shared/components/data-grid/name/data-grid-name.component';
import { ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { Constants } from 'src/app/@shared/utils/constants';
import { Logger } from 'src/app/@shared/utils/logger';
import { Observable } from 'rxjs';
import { ClientsService } from 'src/app/@core/backend/services/admin/client.service';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { CompaniesService } from 'src/app/@core/backend/services/admin/company.service';

@Component({
	selector: 'mw-admin-company-list',
	templateUrl: './company-list.component.html',
	styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
	gridData$: Observable<any>;

	columnDefs: ColDef[] = [
		{
			headerName: 'Company Name',
			field: 'Name',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'Location',
			field: 'Country'
		},
		{
			headerName: 'Company Code',
			field: 'Details.Code'
		},
		{
			headerName: 'Contact Email',
			field: 'Email'
		},
		{
			headerName: 'ID',
			field: 'SK',
			hide: true
		},
		{
			headerName: 'Action',
			cellRenderer: 'gridActions',
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
		private companiesService: CompaniesService
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope
		};
	}

	ngOnInit(): void {
		this.gridData$ = this.companiesService.getList();
	}

	receiveAction(actionObj: { action: string; data: [] }) {
		this.gridScope.showDetail(actionObj.data);
	}

	showDetail(item: any) {
		Logger.log(item);
		const stateData = {
			state: {
				data: {
					item: item
				}
			}
		};
		this.router.navigate(['modules/admin/company/'], stateData);
	}

	goBack() {
		this.router.navigate(['modules/admin']);
	}
}
