import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component
} from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { AgRendererComponent } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Logger } from 'src/app/@shared/utils/logger';
import { Constants } from 'src/app/@shared/utils/constants';
import { UIUtil } from 'src/app/@shared/utils/ui-util';
import { ReScheduleComponent } from '../reschedule/reschedule.component';
import { CancelComponent } from '../cancel/cancel.component';
import { JoinNowComponent } from '../join-now/join-now.component';
import { BookingStatusLabelPipe } from 'src/app/@shared/pipes';
import { ApptJoinService } from 'src/app/@core/backend/services/appointment/appt-join.service';
import { takeWhile } from 'rxjs/operators';
import { ClassJoinService } from 'src/app/@core/backend/services/class/class-join.service';
import { GroupJoinService } from 'src/app/@core/backend/services/group/group-join.service';
@Component({
	selector: 'mw-grid-actions',
	templateUrl: './grid-actions.component.html',
	styleUrls: ['./grid-actions.component.scss'],
	providers: [BookingStatusLabelPipe]
})
export class GridActionsComponent implements AgRendererComponent {
	params: ICellRendererParams;
	data: any;
	classType: any;
	isGroup: boolean = false;
	bookingStatusLabel: any;
	isLoading: boolean = false;
	gridType: string;
	private alive: boolean = true;

	CONST = Constants;

	constructor(
		public dialogService: MatDialog,
		public dialog: MatDialog,
		private router: Router,
		private bookingStatusLabelPipe: BookingStatusLabelPipe,
		private cd: ChangeDetectorRef,
		private apptJoinService: ApptJoinService,
		private classJoinService: ClassJoinService,
		private groupJoinService: GroupJoinService
	) {}

	agInit(params: ICellRendererParams): void {
		this.params = params;
		this.data = params.data;
		this.gridType = params.context.gridType;
		this.classType = this.gridType ? this.gridType : this.data.Type;
		if (this.gridType === Constants.CLASS_TYPE_GROUP) {
			this.isGroup = true;
		}
		this.refreshBookingStatusLabel();
	}

	refreshBookingStatusLabel(detectChanges?: boolean): void {
		this.bookingStatusLabel = this.bookingStatusLabelPipe.transform(
			this.data.StartDateTime,
			this.isGroup,
			this.data,
			this.gridType ? this.gridType : this.data.Type
		);
		if (detectChanges) {
			this.cd.detectChanges();
		}
	}

	refresh(): boolean {
		return false;
	}

	handleClick(action: string) {
		Logger.log(this.data);
		switch (action) {
			case 'GR': // Grid Action (CheckIn Or Join)
				this.handleGridAction();
				break;
			case 'C': // Cancel
				this.handleCancel();
				break;
			case 'R': // Rechedule
				this.handleReschedule();
				break;
			default:
				// Handle in Parent Component (Example, Admin)
				this.params.context.receiveAction({ action, data: this.data });
				break;
		}
	}

	private handleGridAction(): void {
		const data = {
			state: {
				data: this.data
			}
		};
		const bookingStatus = UIUtil.getBookingStatusLabel(
			this.data.StartDateTime,
			this.data,
			this.gridType ? this.gridType : this.data.Type
		);
		if (bookingStatus == Constants.LABEL_BUTTON_CHECKIN) {
			const data = {
				state: {
					data: {
						classType: this.gridType
							? this.gridType
							: this.data.Type,
						data: this.data
					}
				}
			};
			this.router.navigate(['/modules/checkin'], data);
		} else if (bookingStatus == Constants.LABEL_BUTTON_BOOK_NOW) {
			this.btnClicked(bookingStatus);
		} else if (bookingStatus == Constants.LABEL_BUTTON_JOIN_REQUEST) {
			this.router.navigate(['/modules/group/join'], data);
		} else if (bookingStatus == Constants.LABEL_BUTTON_JOIN) {
			this.data['classType'] = this.gridType
				? this.gridType
				: this.data.Type;
			Logger.log(
				'Change joinNowComponent to the work the same way as ReschedulecComponent. Make the apptJoinservice call in the ngInit of JoinNowComponent'
			);
			this.handleJoinNow();
		}
	}

	private handleCancel(): void {
		this.data['type'] = this.gridType ? this.gridType : this.data.Type;
		this.data['cancel_type'] = this.onValidate(this.data.StartDateTime);
		const dialogData: any = {
			data: this.data
		};
		const dialogRef = this.dialog.open(CancelComponent, dialogData);
	}

	onValidate(date: any) {
		const currentDate = new Date();
		const date_value = new Date(date);
		let values: string = '';
		const hours =
			Math.abs(currentDate.getTime() - date_value.getTime()) / 3600000;
		if (hours > 48) {
			values = 'E';
		} else {
			values = 'L';
		}
		return values;
	}

	private handleReschedule(): void {
		let classType = this.gridType ? this.gridType : this.data.Type;
		if (classType == 'Appointment') {
			classType = 'A';
		} else if (classType == 'Class') {
			classType = 'C';
		} else if (classType == 'Group') {
			classType = 'G';
		} else {
			classType = classType;
		}
		this.data['cancel_type'] = this.onValidate(this.data.StartDateTime);
		const bookingStatus = UIUtil.getBookingStatusLabel(
			this.data.StartDateTime,
			this.data,
			this.gridType ? this.gridType : this.data.Type
		);
		const dialogData: any = {
			data: {
				grid_data: this.data,
				classType: classType,
				bookingStatus: bookingStatus
			}
		};

		this.dialog.open(ReScheduleComponent, dialogData);
	}

	private handleJoinNow(): void {
		this.isLoading = true;
		const classType = this.gridType ? this.gridType : this.data.Type;
		if (
			classType == Constants.CLASS_LABEL_APPOINTMENT ||
			classType == Constants.CLASS_TYPE_APPOINTMENT
		) {
			const BookingId = this.data.BookingId
				? this.data.BookingId
				: this.data.data.BookingId;
			this.apptJoinService
				.apptJoin(BookingId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((item) => {
					this.isLoading = false;
					const url = item['Url'];
					// const urlObj = URL.createObjectURL(url);
					// window.open(url, '_blank');
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
			const visitId = this.data.VisitId
				? this.data.VisitId
				: this.data.data.VisitId;
			this.classJoinService
				.classJoin(visitId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((item: any) => {
					this.isLoading = false;
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
			const visitId = this.data.VisitId
				? this.data.VisitId
				: this.data.data.VisitId;
			this.groupJoinService
				.groupJoin(visitId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((item: any) => {
					this.isLoading = false;
					const url = item[0]['Details.ZoomUrl'];
					// window.open(url, '_blank');
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
	btnClicked(action: string) {
		this.params.context.receiveAction({ action, data: this.data });
	}

	watchBookingStatus(countdownStr: string, context: any): string {
		if (Constants.COUNTDOWN_TRIGGER_PATTERNS.includes(countdownStr)) {
			context.refreshBookingStatusLabel(true);
		}
		return countdownStr;
	}
}
