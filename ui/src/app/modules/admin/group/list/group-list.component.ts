import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { GroupConfigService } from 'src/app/@core/backend/services/admin/groups.service';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { BooleanFlagPipe } from 'src/app/@shared/pipes/boolean-flag.pipe';
import { Constants } from 'src/app/@shared/utils/constants';
import { DataGridNameComponent } from '../../../../@shared/components/data-grid/name/data-grid-name.component';

@Component({
	selector: 'mw-admin-group-list',
	templateUrl: './group-list.component.html',
	styleUrls: ['./group-list.component.scss'],
	providers: [BooleanFlagPipe]
})
export class GroupListComponent implements OnInit {
	gridData$: Observable<any>;

	frameworkComponents = {
		gridActions: DataGridActionsComponent,
		gridName: DataGridNameComponent
	};

	columnDefs: ColDef[] = [
		{
			headerName: 'Name',
			field: 'Name',
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
			headerName: 'Open Access',
			field: 'Details.IsOpen',
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
			headerName: 'ID',
			field: 'Id',
			hide: true
		},
		{
			headerName: 'Action',
			cellRenderer: 'gridActions',
			minWidth: 150
		}
	];

	defaultColDef: any = {
		sortable: true,
		resizable: true
	};

	gridContext: any;
	gridScope = this;

	paginationPageSize: any = Constants.DEFAULT_GRID_PAGE_SIZE;

	constructor(
		private router: Router,
		private groupService: GroupConfigService,
		private booleanFlagPipe: BooleanFlagPipe
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope
		};
	}

	receiveAction(actionObj: { action: string; data: any }) {
		this.gridScope.showDetail(actionObj);
	}

	showDetail(item: any) {
		const stateData = {
			state: {
				data: {
					item: item
				}
			}
		};
		this.router.navigate(['modules/admin/group/'], stateData);
	}

	ngOnInit(): void {
		this.gridData$ = this.groupService.getList();
	}

	onAddConfiguration() {
		this.router.navigate(['modules/admin/groups']);
	}

	goBack() {
		this.router.navigate(['modules/admin']);
	}
}
