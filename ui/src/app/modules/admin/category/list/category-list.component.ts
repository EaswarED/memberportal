import { Component, OnInit } from '@angular/core';
import { CATEGORIES_DATA } from 'src/assets/mock-data';
import { DataGridNameComponent } from 'src/app/@shared/components/data-grid/name/data-grid-name.component';
import { ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { ProgramService } from 'src/app/@core/backend/services/site/programs.service';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { UIUtil } from 'src/app/@shared/utils/ui-util';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { Constants } from 'src/app/@shared/utils/constants';
import { Logger } from 'src/app/@shared/utils/logger';
import { ClassTypeLabelPipe } from 'src/app/@shared/pipes/classType-label.pipe';
import { Observable } from 'rxjs';

@Component({
	selector: 'mw-admin-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss'],
	providers: [ClassTypeLabelPipe]
})
export class CategoryListComponent implements OnInit {
	gridData$: Observable<any>;

	columnDefs: ColDef[] = [
		{
			headerName: 'Name',
			field: 'Details.Name',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'Description',
			field: 'Details.Description'
		},
		{
			headerName: 'Type',
			field: 'Details.Type',
			valueFormatter: (params) =>
				this.classTypeLabelPipe.transform(params.value)
		},
		{
			headerName: 'Id',
			field: 'SK',
			hide: true
		},
		{
			headerName: 'Status',
			cellRenderer: 'gridActions',
			maxWidth: 200
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
		private categoriesService: CategoriesService,
		private classTypeLabelPipe: ClassTypeLabelPipe
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope
		};
	}

	ngOnInit(): void {
		this.gridData$ = this.categoriesService.getList();
	}

	receiveAction(actionObj: { action: string; data: any }) {
		this.gridScope.showDetail(actionObj.data.SK);
	}

	showDetail(val: any) {
		let id = '';
		if (val) {
			id = val;
		}
		this.router.navigate(['modules/admin/category/' + id]);
	}

	goBack() {
		this.router.navigate(['modules/admin']);
	}
}
