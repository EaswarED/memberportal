import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { OnlineFormService } from 'src/app/@core/backend/services/admin/form.service';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { Constants } from 'src/app/@shared/utils/constants';
import { UIUtil } from 'src/app/@shared/utils/ui-util';
import { DataGridNameComponent } from '../../../../@shared/components/data-grid/name/data-grid-name.component';
import { OnlineFormDetailComponent } from '../detail/online-form-detail.component';

@Component({
	selector: 'mw-online-form-list',
	templateUrl: './online-form-list.component.html',
	styleUrls: ['./online-form-list.component.scss']
})
export class OnlineFormListComponent implements OnInit {
	gridDataClinical$: Observable<any>;
	gridDataNonClinical$: Observable<any>;

	@ViewChild('tabGroup') tabGroup: MatTabGroup;

	columnDefs: ColDef[] = [
		{
			headerName: 'Name',
			field: 'Name',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'Frequency',
			field: 'Details.Validity',
			valueFormatter: UIUtil.formatValidity
		},
		{
			headerName: 'Id',
			field: 'id',
			hide: true
		},
		{
			headerName: 'Action',
			cellRenderer: 'gridActions',
			minWidth: 150,
			maxWidth: 150
		}
	];

	frameworkComponents = {
		gridActions: DataGridActionsComponent,
		gridName: DataGridNameComponent
	};

	gridContext: any;
	gridScope = this;

	selectedTabIndex = 0;
	type: string;

	constructor(
		private router: Router,
		private onlineFormService: OnlineFormService,
		public dialog: MatDialog
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope
		};
	}

	ngOnInit(): void {
		this.loadData();
	}

	loadData(): void {
		this.gridDataClinical$ = this.onlineFormService.getList(
			Constants.FORM_TYPE_CLINICAL
		);
		this.gridDataNonClinical$ = this.onlineFormService.getList(
			Constants.FORM_TYPE_NON_CLINICAL
		);
		if (this.selectedTabIndex == 0) {
			this.type = 'c';
		}
	}

	receiveAction(actionObj: { action: string; data: [] }, $event: any) {
		this.gridScope.onOpenDialog(actionObj.data);
	}

	onOpenDialog(item: any) {
		this.dialog.open(OnlineFormDetailComponent, {
			data: {
				item: item,
				type: this.type
			}
		});
	}

	tabChanged(event: any) {
		this.selectedTabIndex = event.index;
		if (this.selectedTabIndex == 1) {
			this.type = Constants.FORM_TYPE_NON_CLINICAL;
		} else {
			this.type = Constants.FORM_TYPE_CLINICAL;
		}
	}

	goBack() {
		this.router.navigate(['modules/admin']);
	}
}
