import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/@core/backend/services/admin/user.service';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { DataGridNameComponent } from 'src/app/@shared/components/data-grid/name/data-grid-name.component';
import { Constants } from 'src/app/@shared/utils/constants';
import { Logger } from 'src/app/@shared/utils/logger';
@Component({
	selector: 'mw-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
	gridData$: Observable<any>;

	searchByEmail: any;

	columnDefs: ColDef[] = [
		{
			headerName: 'FirstName',
			field: 'firstName',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'LastName',
			field: 'lastName',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'Company',
			field: 'CompanyName',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'Email-id',
			field: 'email',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'PK',
			field: 'PK',
			hide: true,
			cellRenderer: 'gridName'
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
	defaultColDef: any = {
		sortable: true,
		resizable: true
	};

	gridContext: any;
	gridScope = this;

	actionList = [
		{
			icon: 'edit',
			tip: 'Edit',
			action: 'edit'
		}
	];
	getActions(): any[] {
		return this.gridScope.actionList;
	}
	constructor(private router: Router, private userService: UserService) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope,
			getActions: this.getActions
		};
	}

	ngOnInit(): void {
		this.gridData$ = this.userService.getList();
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
		this.router.navigate(['modules/admin/user/'], stateData);
	}
	onBackAction() {
		this.router.navigate(['modules/admin']);
	}
	onSearch() {
		this.gridData$ = this.userService.get(this.searchByEmail);
		console.log('onSearch', this.gridData$);
	}
}
