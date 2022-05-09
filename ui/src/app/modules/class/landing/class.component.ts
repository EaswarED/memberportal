import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataGridNameComponent } from '../../../@shared/components/data-grid/name/data-grid-name.component';
import { DataGridDateComponent } from '../../../@shared/components/data-grid/date/data-grid-date.component';
import { LandingClassService } from 'src/app/@core/backend/services/class/landing.service';
import { ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { OtherService } from 'src/app/@core/backend/services/class/other-service.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { GridActionsComponent } from '../../actions/grid-actions/grid-actions.component';
import { UIUtil } from 'src/app/@shared/utils/ui-util';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/@shared/utils/constants';
import { takeWhile } from 'rxjs/operators';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { ClassConfigService } from 'src/app/@core/backend/services/admin/classes.service';
import { CalendarDataComponent } from 'src/app/@shared/components/calendar-data/calendar-data.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'mw-class',
	templateUrl: './class.component.html',
	styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit, OnDestroy {
	alive: boolean = true;
	isReadMore = false;

	CONST = Constants;

	gridList: any[];
	filteredGridList: any[];
	categoryData$: Observable<any>;

	dateFilterList = UIUtil.getDateFilterList();
	selectedFilter: number = 0;

	sessionTypeList: any[];
	selectedCategory: any;
	cardList: any;
	showCard: boolean = false;

	columnDefs: ColDef[] = [
		{
			headerName: 'Class',
			field: 'Name',
			cellRenderer: 'gridName',
			minWidth: 230
		},
		{
			headerName: 'Provider',
			field: 'StaffName',
			minWidth: 200
		},
		{
			headerName: 'Date',
			field: 'StartDateTime',
			cellRenderer: 'gridDate',
			maxWidth: 170,
			minWidth: 200
		},
		{
			headerName: 'Id',
			field: 'Id',
			hide: true
		},
		{
			headerName: 'Status',
			cellRenderer: 'gridActions',
			minWidth: 300
		}
	];

	gridContext: any;
	gridScope = this;
	frameworkComponents = {
		gridActions: GridActionsComponent,
		gridName: DataGridNameComponent,
		gridDate: DataGridDateComponent
	};

	description =
		'You can book, join, or cancel from the menu to the right of the class. You will be able to join your session 5 minutes prior to the scheduled start time. ';
	classCalendarList: any[] = [];

	constructor(
		private router: Router,
		private otherService: OtherService,
		private categoriesService: CategoriesService,
		private landingService: LandingClassService,
		private classConfigService: ClassConfigService,
		private dialog: MatDialog
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope,
			gridType: Constants.CLASS_TYPE_CLASS
		};
	}

	ngOnDestroy(): void {
		this.alive = false;
	}

	ngOnInit(): void {
		this.loadData();
	}

	onHandleClick(event: any) {
		const data = {
			state: {
				data: {
					categoryId: event.CategoryId,
					sessionId: event.DescriptionId
				}
			}
		};
		this.router.navigate(['/modules/class/create'], data);
	}

	loadData() {
		this.landingService
			.getLandinglist()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.gridList = data;
				data.forEach((element: any) => {
					this.classCalendarList.push({
						title: element.Name,
						start: element.StartDateTime
					});
				});
				this.refreshList();
			});
		this.categoryData$ = this.landingService.type(
			Constants.CLASS_TYPE_CLASS
		);

		this.landingService
			.getList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.sessionTypeList = data;
			});
	}

	receiveAction(actionObj: { action: string; data: any }) {
		const action = actionObj.action;
		const data = actionObj.data;
		this.gridScope.onHandleClick(data);
		Logger.debug('TODO: Placeholder action.. use when needed');
	}

	handleMoreLess() {
		this.isReadMore = !this.isReadMore;
	}

	bookClasses() {
		this.router.navigate(['/modules/class/create']);
	}

	refreshList(): void {
		if (this.selectedFilter === 0) {
			this.filteredGridList = this.gridList;
			return;
		}
		let currDate = new Date();
		currDate.setDate(currDate.getDate() + this.selectedFilter);
		this.filteredGridList = this.gridList.filter(
			(item: any) => new Date(item.StartDateTime) <= currDate
		);
	}

	openCard(item: any) {
		this.selectedCategory = item;
		this.showCard = true;
		this.cardList = this.sessionTypeList.filter(
			(type: any) => type.CategoryId == item.SK
		);
	}

	handleClose() {
		this.showCard = false;
	}

	openCalendar(): void {
		this.dialog.open(CalendarDataComponent, {
			data: this.classCalendarList,
			width: '100%'
		});
	}

	callToAction(event: any) {
		const data = {
			state: {
				data: {
					categoryId: event.CategoryId,
					sessionId: event.Id
				}
			}
		};
		this.router.navigate(['/modules/class/create'], data);
	}
}
