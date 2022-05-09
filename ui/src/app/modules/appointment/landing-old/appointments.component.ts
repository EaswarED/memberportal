import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	OTHER_SERVICES,
	ALL_APPOINTMENTS,
	APPOINTMENTS_HEADER
} from '../../../../assets/mock-data';
import { DataGridNameComponent } from '../../../@shared/components/data-grid/name/data-grid-name.component';
import { LandingApptService } from 'src/app/@core/backend/services/appointment/landing.service';
import { ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { DataGridDateComponent } from '../../../@shared/components/data-grid/date/data-grid-date.component';
import { OtherService } from 'src/app/@core/backend/services/appointment/other-service.service';
import { ClassService } from 'src/app/@core/backend/services/appointment/classes-service.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { GridActionsComponent } from '../../actions/grid-actions/grid-actions.component';

@Component({
	selector: 'mw-appointments',
	templateUrl: './appointments.component.html',
	styleUrls: ['./appointments.component.scss']
})
export class OldAppointmentsComponent implements OnInit {
	date: Date;
	recommendedContent = OTHER_SERVICES;
	activities = ALL_APPOINTMENTS;
	gridColumns = APPOINTMENTS_HEADER;

	tableData: any;
	calendarApptData: any = [];
	paginationPageSize: any = 5;
	defaultColDef: any = {
		sortable: true,
		resizable: true
	};
	codeA: string;
	description =
		'You can book, check-in, join, Reschedule or cancel from the menu to the right of the appointment You will be able to check-in 48 hours prior to your appointment and fill out any formats that may be required. You will be able to join your session 5 minutes prior to the scheduled start time. Our cancellation and rescheduling policy is 24 hours advance notice.Cancelling or rescheduling after that time will not result in a credit for that appointment. ';
	columnDefs: ColDef[] = [
		{
			headerName: 'Session',
			field: 'appointmentName',
			cellRenderer: 'gridName',
			minWidth: 200
		},
		{
			headerName: 'Provider',
			field: 'staffName',
			minWidth: 200
		},
		{
			headerName: 'Date',
			field: 'startDateTime',
			cellRenderer: 'gridDate',
			maxWidth: 170,
			minWidth: 200
		},
		{
			headerName: 'Id',
			field: 'appointmentId',
			hide: true
		},
		{
			headerName: 'Status',
			field: 'status',
			cellRenderer: 'gridActions',
			minWidth: 300
		}
	];
	gridApptActions = this;

	context_data: any;

	frameworkComponents = {
		gridActions: GridActionsComponent,
		gridName: DataGridNameComponent,
		gridDate: DataGridDateComponent
	};
	isDisplayCard: boolean = false;
	isDisplay: boolean = true;
	programList: any;
	classList: any;
	selectedClassList: any;
	isActive: number;
	title: any;
	selectedLength: any;
	maxLenBIO: any = 0;
	readMoreBTN: boolean = true;
	isDisplayCalendar = false;
	isDisplayTable = true;
	data_appt: any;
	timePeriod = [
		{ name: 'Next 7 days', code: '7d' },
		{ name: 'This Month', code: 'm' },
		{ name: 'Next Month', code: 'nm' },
		{ name: 'Past 7 days', code: 'p7d' }
	];
	selectedPeriod = this.timePeriod[1].code;
	alive: boolean;
	sortModel: any = [{ colId: 'startDateTime', sort: 'desc' }];
	apptList: any;
	selectedApptList: any = [];

	constructor(
		private router: Router,
		private otherService: OtherService,
		private classService: ClassService,
		private landingService: LandingApptService
	) {
		this.context_data = {
			receiveAction: this.receiveAction,
			gridActions: this.gridApptActions,
			code: 'A'
		};
	}
	ngOnInit(): void {
		this.load_data();
	}
	receiveAction(actionObj: { action: string; data: [] }) {
		Logger.debug(actionObj.data);
	}
	load_data() {
		this.selectedLength = this.description.length;

		this.selectedApptList = [];

		if (this.apptList) {
			this.selectedApptList.push(this.apptList[0]);

			if (this.apptList[0]) {
				this.isActive = this.apptList[0]['id'];
			}
		}

		setTimeout(() => {
			// <<<---using ()=> syntax
			var now = '04/09/2013 15:00:00';
			var then = '02/09/2013 14:20:30';

			var hourDiff = new Date(now).getHours() - new Date(then).getHours();
		}, 1000);

		this.codeA = 'A';

		this.selectedClassList = [];
		this.otherService_program_load_data();
		if (this.selectedPeriod === 'm') {
			var currentDate = new Date();
			var firstDay = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				1
			);
			var lastDay = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth() + 1,
				0
			);

			this.landingService.getLandinglist().subscribe((data: any) => {
				this.tableData = data.filter(
					(type: any) =>
						new Date(type.startDateTime) >= firstDay &&
						new Date(type.startDateTime) <= lastDay
				);
			});
		}

		this.landingService.getLandinglist().subscribe((data: any) => {
			data.forEach((element: any) => {
				this.calendarApptData.push({
					id: element.appointmentId,
					title: element.appointmentName,
					start: element.startDateTime
				});
			});
		});
	}
	btnClicked() {
		this.router.navigate(['/appt/create']);
	}
	onOpenTherapy(e: any) {
		if (e.id) {
			this.title = e.name;
			this.isDisplayCard = true;
			this.isDisplay = false;
			this.otherService.getSsessionApptlist().subscribe((data: any) => {
				this.apptList = data.filter(
					(type: any) => type.programId == e.id
				);

				this.load_data();
			});
		} else {
			this.isDisplayCard = false;
			this.isDisplay = true;
		}
	}

	selectedClass(e: any) {
		if (e) {
			this.otherService.getSsessionApptlist().subscribe((data: any) => {
				this.selectedApptList = data.filter(
					(type: any) => type.id == e
				);

				if (this.selectedClassList) {
					this.isActive = e;
				}
			});
		} else {
		}
	}

	onClosedTherapy(e: any) {
		if (e) {
			this.isDisplayCard = false;
			this.isDisplay = true;
			this.router
				.navigateByUrl('/', {
					skipLocationChange: true
				})
				.then(() => {
					this.router.navigate(['appt']);
				});
		}
	}

	onCallTherapy(event: any) {
		this.router.navigate(['appt/create'], {
			state: {
				data: {
					programId: event.programId,
					sessionId: event.id,
					staffId: 0
				}
			}
		});
	}

	onPeriodChange(event: any) {
		if (this.selectedPeriod === 'p7d') {
			var currentDate = new Date();
			currentDate.setDate(currentDate.getDate() - 1);
			var lastDate = new Date(
				currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
			);

			this.landingService.getLandinglist().subscribe((data: any[]) => {
				this.tableData = data.filter(
					(type: any) =>
						new Date(type.startDateTime) >= lastDate &&
						new Date(type.startDateTime) < currentDate
				);
			});
		} else if (this.selectedPeriod === 'nm') {
			var currentDate = new Date();
			var nextMonth = new Date(currentDate);
			nextMonth.setMonth(currentDate.getMonth() + 1);
			this.landingService.getLandinglist().subscribe((data: any[]) => {
				this.tableData = data.filter(
					(type: any) =>
						new Date(type.startDateTime) >= nextMonth &&
						new Date(type.startDateTime) <= currentDate
				);
			});
		} else if (this.selectedPeriod === 'm') {
			var currentDate = new Date();
			var firstDay = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				1
			);
			var lastDay = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth() + 1,
				0
			);

			this.landingService.getLandinglist().subscribe((data: any[]) => {
				this.tableData = data.filter(
					(type: any) =>
						new Date(type.startDateTime) >= firstDay &&
						new Date(type.startDateTime) <= lastDay
				);
			});
		} else {
			var currentDate = new Date();
			var nextDate = new Date(
				currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
			);
			this.landingService.getLandinglist().subscribe((data: any[]) => {
				this.tableData = data.filter(
					(type: any) =>
						new Date(type.startDateTime) < nextDate &&
						new Date(type.startDateTime) >= currentDate
				);
			});
		}
	}

	otherService_program_load_data(): void {
		this.otherService.getProgramApptlist().subscribe((data: any) => {
			this.programList = data;
		});
	}

	onReadMoreLess(event: any) {
		if (event === 'M') {
			this.maxLenBIO = this.selectedLength;
			this.readMoreBTN = false;
		} else {
			this.maxLenBIO = 0;
			this.readMoreBTN = true;
		}
	}

	onListToCalendar(event: any) {
		if (event === 'L') {
			this.isDisplayCalendar = false;
			this.isDisplayTable = true;
		} else {
			this.isDisplayCalendar = true;
			this.isDisplayTable = false;
		}
	}
	onCalendarEvent(event: any) {
		Logger.debug(event);
	}
	onCalendarEvents(event: any) {
		Logger.debug(Number(event._def.publicId));
		this.landingService.getLandinglist().subscribe((data: any) => {
			this.tableData = data.filter(
				(type: any) => type.appointmentId == Number(event._def.publicId)
			);
		});
		this.isDisplayCalendar = false;
		this.isDisplayTable = true;
	}
}
