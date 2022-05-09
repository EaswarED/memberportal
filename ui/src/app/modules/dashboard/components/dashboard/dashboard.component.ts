import { Component, OnInit } from '@angular/core';
import { DataGridNameComponent } from '../../../../@shared/components/data-grid/name/data-grid-name.component';
import { DataGridDateComponent } from '../../../../@shared/components/data-grid/date/data-grid-date.component';
import { ColDef } from 'ag-grid-community';

import { RecommendService } from 'src/app/@core/backend/services/dashboard/recommend.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { UpcomingService } from 'src/app/@core/backend/services/dashboard/upcoming.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DashboardCalendarComponent } from '../dashboard-calendar/dashboard-calendar.component';
import { Constants } from 'src/app/@shared/utils/constants';
import { UIUtil } from 'src/app/@shared/utils/ui-util';
import { SiteContentSerice } from 'src/app/@core/backend/services/dashboard/site-content.service';
import { GridActionsComponent } from 'src/app/modules/actions/grid-actions/grid-actions.component';
import { Util } from 'src/app/@shared/utils/util';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { takeWhile } from 'rxjs/operators';
import { JoinNowComponent } from 'src/app/modules/actions/join-now/join-now.component';
import { ApptJoinService } from 'src/app/@core/backend/services/appointment/appt-join.service';
import { ClassJoinService } from 'src/app/@core/backend/services/class/class-join.service';
import { GroupJoinService } from 'src/app/@core/backend/services/group/group-join.service';

@Component({
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	alive = true;
	recAppointments$: Observable<any>;
	recClasses$: Observable<any>;
	recGroups$: Observable<any>;
	recommendedContent$: Observable<any>;
	calActivitiesList: any = [];
	activitiesList = [];
	selectedData: any;
	loading: boolean = false;
	CONST = Constants;

	defaultColDef: any = {
		sortable: true,
		resizable: true
	};
	columnDefs: ColDef[] = [
		{
			headerName: 'Type',
			field: 'Type',
			minWidth: 200
		},
		{
			headerName: 'Session',
			field: 'Name',
			cellRenderer: 'gridName',
			minWidth: 200
		},
		{
			headerName: 'Date',
			field: 'StartDateTime',
			cellRenderer: 'gridDate',
			minWidth: 200
		},
		{
			headerName: 'Provider',
			field: 'StaffName',
			minWidth: 200
		},
		{
			headerName: 'Status',
			cellRenderer: 'gridActions',
			minWidth: 300
		}
	];

	//TODO:Final => AG Grid: as of version 24.0.0, setSortModel() is deprecated, sort information is now part of Column State. Please use columnApi.applyColumnState() instead.
	sortModel: any = [{ colId: 'startDateTime', sort: 'desc' }];
	//TODO:Final: Why are these variables needed?
	onApptCount: number = 0;
	onClassCount: number = 0;
	onGroupCount: number = 0;

	frameworkComponents = {
		gridActions: GridActionsComponent,
		gridName: DataGridNameComponent,
		gridDate: DataGridDateComponent
	};
	gridContext: any;
	gridScope = this;

	constructor(
		private recommendService: RecommendService,
		private router: Router,
		public dialog: MatDialog,
		private upcomingService: UpcomingService,
		private contentService: SiteContentSerice,
		private apptJoinService: ApptJoinService,
		private classJoinService: ClassJoinService,
		private groupJoinService: GroupJoinService
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope
		};
	}

	ngOnInit(): void {
		this.initialize();
	}

	receiveAction(actionObj: { action: string; data: any }) {
		const action = actionObj.action;
		const data = actionObj.data;

		Logger.debug('TODO: Placeholder action.. use when needed');
	}

	private initialize(): void {
		this.upcomingService
			.getUpcomingActivityList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.activitiesList = data;
				this.onApptCount = data.filter(
					(e: { Type: string }) => e.Type === 'Appointment'
				).length;
				this.onClassCount = data.filter(
					(e: { Type: string }) => e.Type === 'Class'
				).length;
				this.onGroupCount = data.filter(
					(e: { Type: string }) => e.Type === 'Group'
				).length;
				data.forEach((element: any) => {
					this.calActivitiesList.push({
						title: element.Name,
						start: element.StartDateTime,
						end: element.StartDateTime,
						backgroundColor:
							element.Type === 'Appointment'
								? '#fed268'
								: element.Type === 'Class'
								? '#828282'
								: '#9adae9'
					});
				});
			});
		this.recAppointments$ = this.recommendService.getRecommendedApptList();
		this.recClasses$ = this.recommendService.getRecommendedClassList();
		this.recGroups$ = this.recommendService.getRecommendedGroupList();
		this.recommendedContent$ = this.contentService.getSelfcareVimeoList();
	}

	handleCardClick(emitData: any): void {
		const classType: any = emitData.classType;
		const rowData: any = emitData.data;
		const label: any = emitData.label;

		if (!rowData) {
			// View All Clicked
			if (classType === Constants.CLASS_TYPE_APPOINTMENT) {
				this.router.navigate(['/modules/appt']);
			} else if (classType === Constants.CLASS_TYPE_CLASS) {
				this.router.navigate(['/modules/class']);
			} else if (classType === Constants.CLASS_TYPE_GROUP) {
				this.router.navigate(['/modules/group']);
			}
		} else if (Util.toInt(rowData.BookingId) > 0) {
			const bookingStatus = UIUtil.getBookingStatusLabel(
				rowData.StartDateTime,
				rowData,
				classType
			);
			const data: any = {
				state: {
					data: emitData
				}
			};
			if (bookingStatus == Constants.LABEL_BUTTON_CHECKIN) {
				this.router.navigate(['/modules/checkin'], data);
			} else if (bookingStatus == Constants.LABEL_BUTTON_JOIN) {
				this.selectedData = rowData;
				this.handleJoinNow(emitData);
			}
		} else if (label == Constants.LABEL_BUTTON_JOIN_REQUEST) {
			const data: any = {
				state: {
					data: {
						categoryId: rowData.CategoryId,
						sessionId: rowData.DescriptionId
					}
				}
			};
			this.router.navigate(['/modules/group/join'], data);
		} else if (label == Constants.LABEL_BUTTON_JOIN_PENDING) {
			Logger.log('Handle Join Pending... Lets discuss');
		} else if (Util.toInt(rowData.BookingId) === 0) {
			// No Booking... create booking
			const data: any = {
				state: {
					data: {
						categoryId: rowData.CategoryId,
						sessionId: rowData.Id
							? rowData.Id
							: rowData.DescriptionId
					}
				}
			};
			if (classType === Constants.CLASS_TYPE_APPOINTMENT) {
				this.router.navigate(['/modules/appt/create'], data);
			} else if (classType === Constants.CLASS_TYPE_CLASS) {
				this.router.navigate(['/modules/class/create'], data);
			} else if (classType === Constants.CLASS_TYPE_GROUP) {
				this.router.navigate(['/modules/group/create'], data);
			}
		}
	}

	private handleJoinNow(emitData: any): void {
		this.loading = true;
		const classType = emitData.Type ? emitData.Type : emitData.classType;
		if (
			classType == Constants.CLASS_LABEL_APPOINTMENT ||
			classType == Constants.CLASS_TYPE_APPOINTMENT
		) {
			const BookingId = emitData.data.BookingId;
			this.apptJoinService
				.apptJoin(BookingId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((item) => {
					this.loading = false;
					const url = item['Url'];
					if (url) {
						var myWindow: any = window.open(
							url,
							'_blank',
							'toolbar=1,scrollbars=1,location=0,statusbar=0,menubar=1,resizable=1,width=800,height=600,left = 240,top = 212'
						);
						myWindow.focus();
					}
				});
		} else if (
			classType == Constants.CLASS_LABEL_CLASS ||
			classType == Constants.CLASS_TYPE_CLASS
		) {
			const visitId = emitData.data.VisitId;
			this.classJoinService
				.classJoin(visitId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((item: any) => {
					this.loading = false;
					const url = item[0]['Details.ZoomUrl'];
					if (url) {
						var myWindow: any = window.open(
							url,
							'_blank',
							'toolbar=1,scrollbars=1,location=0,statusbar=0,menubar=1,resizable=1,width=800,height=600,left = 240,top = 212'
						);
						myWindow.focus();
					}
				});
		} else {
			const visitId = emitData.data.VisitId;
			this.groupJoinService
				.groupJoin(visitId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((item: any) => {
					this.loading = false;
					const url = item[0]['Details.ZoomUrl'];
					if (url) {
						var myWindow: any = window.open(
							url,
							'_blank',
							'toolbar=1,scrollbars=1,location=0,statusbar=0,menubar=1,resizable=1,width=800,height=600,left = 240,top = 212'
						);
						myWindow.focus();
					}
				});
		}

		// this.dialog.open(JoinNowComponent, {
		// 	width: '50%',
		// 	height: '60%',
		// 	data: dialogData.data
		// });
	}

	openCalendar(): void {
		const calendarData = {
			name: 'Dashboard',
			item: this.calActivitiesList,
			onApptCount: this.onApptCount,
			onClassCount: this.onClassCount,
			onGroupCount: this.onGroupCount
		};
		const dialogRef = this.dialog.open(DashboardCalendarComponent, {
			width: '100%',
			data: calendarData
		});
	}

	refreshCardData(classType: string): void {
		if (classType === Constants.CLASS_TYPE_APPOINTMENT) {
			this.recAppointments$ =
				this.recommendService.getRecommendedApptList();
		} else if (classType === Constants.CLASS_TYPE_CLASS) {
			this.recClasses$ = this.recommendService.getRecommendedClassList();
		} else if (classType === Constants.CLASS_TYPE_GROUP) {
			this.recGroups$ = this.recommendService.getRecommendedGroupList();
		}
	}
	handleClick(event: any) {
		this.router.navigate(['modules/selfcare/information'], {
			state: {
				data: event
			}
		});
	}
}
