import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataGridNameComponent } from 'src/app/@shared/components/data-grid/name/data-grid-name.component';
import { ColDef } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/@shared/utils/constants';
import { Observable } from 'rxjs';
import { PromotionService } from 'src/app/@core/backend/services/admin/promotion.service';
import { BooleanFlagPipe, CountPipe } from 'src/app/@shared/pipes';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { Logger } from 'src/app/@shared/utils/logger';
import { DialogCompaniesComponent } from 'src/app/modules/actions/dialog-companies/dialog-companies.component';
import { MatDialog } from '@angular/material/dialog';
import { takeWhile } from 'rxjs/operators';
import { DialogClientComponent } from 'src/app/modules/actions/dialog-client/dialog-client.component';

@Component({
	selector: 'mw-promotion-list',
	templateUrl: './promotion-list.component.html',
	styleUrls: ['./promotion-list.component.scss'],
	providers: [BooleanFlagPipe, CountPipe]
})
export class PromotionListComponent implements OnInit, OnDestroy {
	private classType: string = Constants.CLASS_TYPE_APPOINTMENT;
	private alive: boolean = true;
	isLoading: boolean;

	gridApptData$: Observable<any>;
	gridClassData$: Observable<any>;
	gridGroupData$: Observable<any>;
	gridContentData$: Observable<any>;
	tabIndex: any;

	columnDefs: ColDef[] = [
		{
			headerName: 'Id',
			field: 'SK',
			hide: true
		},
		{
			headerName: 'Name',
			field: 'Name'
		},
		{
			headerName: 'Global',
			field: 'PromotionGlobalIn',
			valueFormatter: (params) =>
				this.booleanFlagPipe.transform(params.value)
		},
		{
			headerName: 'Companies',
			field: 'PromotionCompanyList',
			valueFormatter: (params) => this.countPipe.transform(params.value),
			cellStyle: {
				textAlign: 'center',
				textDecoration: 'underline',
				cursor: 'pointer'
			},
			maxWidth: 140,
			onCellClicked: this.onCompanyCellClicked.bind(this)
		},
		{
			headerName: 'Clients',
			field: 'PromotionClientList',
			valueFormatter: (params) => this.countPipe.transform(params.value),
			cellStyle: {
				textAlign: 'center',
				textDecoration: 'underline',
				cursor: 'pointer'
			},
			maxWidth: 100,
			onCellClicked: this.onClientCellClicked.bind(this)
		},
		{
			headerName: 'Action',
			cellRenderer: 'gridActions',
			maxWidth: 200
		}
	];

	frameworkComponents = {
		gridActions: DataGridActionsComponent,
		gridName: DataGridNameComponent
	};
	gridContext: any;
	gridScope = this;

	actionList = [
		{
			icon: 'add',
			tip: 'Add',
			action: 'add'
		}
	];
	getActions(): any[] {
		return this.gridScope.actionList;
	}

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private promotionService: PromotionService,
		private booleanFlagPipe: BooleanFlagPipe,
		private countPipe: CountPipe,
		public dialog: MatDialog
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope,
			getActions: this.getActions
		};
	}

	ngOnInit(): void {
		Logger.log('Inside');
		this.gridData();
	}

	gridData() {
		this.tabIndex = 0;
		this.gridApptData$ = this.promotionService.getList(this.classType);
	}
	receiveAction(actionObj: { action: string; data: any }) {
		this.gridScope.addPromotion(actionObj.data.SK);
	}

	goBack() {
		this.router.navigate(['modules/admin']);
	}

	addPromotion(id: any) {
		const data = {
			classId: id,
			classType: this.classType
		};
		this.router.navigate(['../promotion/add'], {
			relativeTo: this.route,
			state: {
				data: data
			}
		});
	}

	tabChanged(tabIndex: any): void {
		Logger.log(tabIndex);
		this.tabIndex = tabIndex;

		if (this.tabIndex === 0) {
			// Appointment
			this.gridApptData$ = this.promotionService.getList('a');
			this.classType = Constants.CLASS_TYPE_APPOINTMENT;
		} else if (this.tabIndex === 1) {
			// Classes
			this.gridClassData$ = this.promotionService.getList('c');
			this.classType = Constants.CLASS_TYPE_CLASS;
		} else if (this.tabIndex === 2) {
			// Groups
			this.gridGroupData$ = this.promotionService.getList('g');
			this.classType = Constants.CLASS_TYPE_GROUP;
		} else if (this.tabIndex === 3) {
			// Self-Care
			this.gridContentData$ = this.promotionService.getList('s');
			this.classType = Constants.CLASS_TYPE_CONTENT;
		}
	}
	onCompanyCellClicked(event: any): void {
		const companyPayload = {
			classId: event.data.SK,
			classType: this.classType,
			promotionType: Constants.ACCESS_PROMOTION_TYPE_COMPANY,
			type: Constants.PROMOTION_TYPE_PROMOTION
		};
		this.isLoading = true;
		this.promotionService
			.getCompanyList(companyPayload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((item) => {
				if (item) {
					const data = {
						item: item,
						detail: companyPayload
					};
					this.isLoading = false;
					const dialogRef = this.dialog.open(
						DialogCompaniesComponent,
						{
							width: '70%',
							data: data
						}
					);
					dialogRef.afterClosed().subscribe((result) => {
						this.tabChanged(this.tabIndex);
					});
				}
			});
	}

	onClientCellClicked(event: any): void {
		const clientPayload = {
			classId: event.data.SK,
			classType: this.classType,
			promotionType: Constants.ACCESS_PROMOTION_TYPE_USER,
			type: Constants.PROMOTION_TYPE_PROMOTION
		};
		this.isLoading = true;
		this.promotionService
			.getClientList(clientPayload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((item) => {
				if (item) {
					const data = {
						item: item,
						detail: clientPayload
					};
					this.isLoading = false;
					const dialogRef = this.dialog.open(DialogClientComponent, {
						width: '70%',
						data: data
					});
					dialogRef.afterClosed().subscribe((result) => {
						this.tabChanged(this.tabIndex);
					});
				}
			});
	}

	ngOnDestroy(): void {
		this.alive = false;
	}
}
