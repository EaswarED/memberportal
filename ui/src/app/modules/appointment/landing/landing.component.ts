import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { LandingApptService } from 'src/app/@core/backend/services/appointment/landing.service';
import { takeWhile } from 'rxjs/operators';
import { DataGridNameComponent } from 'src/app/@shared/components/data-grid/name/data-grid-name.component';
import { DataGridDateComponent } from 'src/app/@shared/components/data-grid/date/data-grid-date.component';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/@shared/utils/constants';
import { Logger } from 'src/app/@shared/utils/logger';
import { UIUtil } from 'src/app/@shared/utils/ui-util';
import { GridActionsComponent } from '../../actions/grid-actions/grid-actions.component';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { ApptConfigService } from 'src/app/@core/backend/services/admin/appointment.service';
import { CalendarDataComponent } from 'src/app/@shared/components/calendar-data/calendar-data.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'mw-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
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
	description =
		'Your scheduled and recommended appointments are listed below.   You can book, check-in, join, reschedule or cancel from the menu to the right of the appointment.<br><br>You will be able to check-in 48 hours prior to your appointment and fill out any forms that may be required.<br><br>You will be able to join your session 5 minutes prior to the scheduled start time.<br><br>Our cancellation and rescheduling policy is 24 hours advance notice. &nbsp';
	columnDefs: ColDef[] = [
		{
			headerName: 'Session',
			field: 'Name',
			minWidth: 220
		},
		{
			headerName: 'Provider',
			field: 'StaffName',
			minWidth: 200
		},
		{
			headerName: 'ID',
			field: 'SessionTypeId',
			hide: true
		},
		{
			headerName: 'Date',
			field: 'StartDateTime',
			cellRenderer: 'gridDate',
			minWidth: 200
		},
		{
			headerName: 'Status',
			field: 'AppointmentStatus',
			cellRenderer: 'gridActions',
			minWidth: 250
		}
	];

	gridContext: any;
	gridScope = this;
	apptCalendarList: any[] = [];
	frameworkComponents = {
		gridActions: GridActionsComponent,
		gridName: DataGridNameComponent,
		gridDate: DataGridDateComponent
	};

	constructor(
		private router: Router,
		private landingService: LandingApptService,
		private apptConfigService: ApptConfigService,
		private categoryService: CategoriesService,
		private dialog: MatDialog
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope,
			gridType: Constants.CLASS_TYPE_APPOINTMENT
		};
	}

	ngOnDestroy(): void {
		this.alive = false;
	}

	ngOnInit(): void {
		this.loadData();
		// let text =
		// 	'You can book, check-in, join, Reschedule or cancel from the menu to the right of the appointment.You will be able to check -in 48 hours prior to your appointment and fill out any formats that may be required.You will be able to join your session 5 minutes prior to the scheduled start time.Our cancellation and rescheduling policy is 24 hours advance notice.Cancelling or rescheduling after that time will not result in a credit for that appointment';
		// let split = text.split('.');
		// split.forEach((data: string) => {
		// 	this.description = data;
		// });
	}

	onHandleClick(event: any) {
		const data = {
			state: {
				data: {
					categoryId: event.CategoryId,
					sessionId: event.Id,
					sessionName: event.Name
				}
			}
		};
		this.router.navigate(['/modules/appt/create'], data);
	}

	loadData() {
		this.landingService
			.getLandinglist()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.gridList = data;

				data.forEach((element: any) => {
					this.apptCalendarList.push({
						title: element.Name,
						start: element.StartDateTime
					});
				});
				this.refreshList();
			});
		this.categoryData$ = this.landingService.type(
			Constants.CLASS_TYPE_APPOINTMENT
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

	bookAppts() {
		this.router.navigate(['/modules/appt/create']);
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
			data: this.apptCalendarList,
			width: '100%'
		});
	}
	callToAction(event: any) {
		const data = {
			state: {
				data: {
					categoryId: event.CategoryId,
					sessionId: event.SessionTypeId
				}
			}
		};
		this.router.navigate(['/modules/appt/create'], data);
	}
}
