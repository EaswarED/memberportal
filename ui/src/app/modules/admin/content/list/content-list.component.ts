import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { ContentService } from 'src/app/@core/backend/services/admin/content.service';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { DataGridDateComponent } from 'src/app/@shared/components/data-grid/date/data-grid-date.component';
import { DataGridNameComponent } from 'src/app/@shared/components/data-grid/name/data-grid-name.component';
import { Observable } from 'rxjs';
import { ContentTypeLabelPipe } from 'src/app/@shared/pipes/contentType-label.pipe';
import { Constants } from 'src/app/@shared/utils/constants';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { takeWhile } from 'rxjs/operators';
import { BooleanFlagPipe } from 'src/app/@shared/pipes/boolean-flag.pipe';

@Component({
	selector: 'mw-admin-content-list',
	templateUrl: './content-list.component.html',
	styleUrls: ['./content-list.component.scss'],
	providers: [ContentTypeLabelPipe, BooleanFlagPipe]
})
export class ContentListComponent implements OnInit, OnDestroy {
	alive: boolean = true;

	gridData: any;
	categoryList$: Observable<any>;

	categoryId: any = '0';

	filteredGridList: any;

	columnDefs: ColDef[] = [
		{
			headerName: 'Id',
			field: 'id',
			hide: true
		},
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
			headerName: 'Type',
			field: 'ContentType',
			valueFormatter: (params) =>
				this.contentTypeLabelPipe.transform(params.value)
		},
		{
			headerName: 'Action',
			field: 'action',
			cellRenderer: 'gridActions',
			minWidth: 150,
			maxWidth: 150
		},
		{
			field: 'SK',
			hide: true
		}
	];

	gridContext: any;
	gridScope = this;

	frameworkComponents = {
		gridActions: DataGridActionsComponent,
		gridName: DataGridNameComponent,
		gridDate: DataGridDateComponent
	};

	constructor(
		private router: Router,
		private contentService: ContentService,
		private contentTypeLabelPipe: ContentTypeLabelPipe,
		private categoriesService: CategoriesService,
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
		const stateData = {
			state: {
				data: {
					item: item
				}
			}
		};
		this.router.navigate(['modules/admin/content/'], stateData);
	}

	ngOnInit(): void {
		this.gridData = this.contentService
			.getList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.gridData = data;
				this.refreshList();
			});
		this.categoryList$ = this.categoriesService.getList(
			Constants.CLASS_TYPE_CONTENT
		);
	}

	btnClicked() {
		this.router.navigate(['modules/admin/content']);
	}

	onBackAction() {
		this.router.navigate(['modules/admin']);
	}

	refreshList(): void {
		if (this.categoryId == '0') {
			this.filteredGridList = this.gridData;
			return;
		}
		this.filteredGridList = this.gridData.filter(
			(item: any) => item.CategoryId == this.categoryId
		);
	}

	ngOnDestroy(): void {
		this.alive = false;
	}
}
