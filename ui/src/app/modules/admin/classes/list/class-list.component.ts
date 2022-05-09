import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { ClassConfigService } from 'src/app/@core/backend/services/admin/classes.service';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { DataGridNameComponent } from '../../../../@shared/components/data-grid/name/data-grid-name.component';
import { BooleanFlagPipe } from 'src/app/@shared/pipes/boolean-flag.pipe';
@Component({
	selector: 'mw-admin-class-list',
	templateUrl: './class-list.component.html',
	styleUrls: ['./class-list.component.scss'],
	providers: [BooleanFlagPipe]
})
export class ClassListComponent implements OnInit {
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
		private ClassConfigService: ClassConfigService,
		private booleanFlagPipe: BooleanFlagPipe
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope
		};
	}
	receiveAction(actionObj: { action: string; data: [] }) {
		this.gridScope.onBtnClicked(actionObj);
	}
	onBtnClicked(item: any) {
		const stateData = {
			state: {
				data: {
					item: item
				}
			}
		};
		this.router.navigate(['modules/admin/class/'], stateData);
	}
	ngOnInit(): void {
		this.gridData$ = this.ClassConfigService.getlist();
	}

	onAddConfiguration() {
		this.router.navigate(['modules/admin/classes']);
	}
	onBackAction() {
		this.router.navigate(['modules/admin']);
	}
}
