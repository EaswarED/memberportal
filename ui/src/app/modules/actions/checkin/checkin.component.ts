import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CheckInService } from 'src/app/@core/backend/services/checkin/checkin.service';
import { Location } from '@angular/common';
import { ApptJoinService } from 'src/app/@core/backend/services/appointment/appt-join.service';
import { ChronoFormService } from 'src/app/@core/backend/services/form/chrono-form.service';
import { Constants } from 'src/app/@shared/utils/constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/@shared/components/dialog-form/dialog-form.component';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { ClassJoinService } from 'src/app/@core/backend/services/class/class-join.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';

@Component({
	selector: 'mw-checkin',
	templateUrl: './checkin.component.html',
	styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {
	checkinDetail$: Observable<any>;
	formList: any;
	historyData: any;
	bookingId: any;
	visitId: any;
	isLoading: boolean = true;
	alive: boolean = true;
	id: any;
	onpatientAdditionalInfo = Constants.FORM_PHQ9_ID;
	medicalInfo = Constants.FORM_MEDICAL_INFO_ID;
	newPatient = Constants.FORM_NEW_PATIENT_ID;
	phq = Constants.FORM_PHQ9_ID;
	gad = Constants.FORM_GAD7_ID;
	fan = Constants.FORM_FAN8_ID;
	bookType: any;
	type: any;
	formId: any;
	clientId: any;
	lastChecked: any;
	jotUrl = Constants.FORM_JOT_URL;
	submitValue = 0;

	constructor(
		private router: Router,
		private apptJoinService: ApptJoinService,
		private classJoinService: ClassJoinService,
		private chronoFormService: ChronoFormService,
		private dialog: MatDialog,
		private location: Location,
		private appStore: AppStore,
		private uiMessagingService: UiMessagingService
	) {}

	ngOnInit(): void {
		this.isLoading = true;
		if (history.state.data) {
			this.historyData = history.state.data;
			this.id = this.historyData.data?.VisitType
				? this.historyData.data?.VisitType
				: this.historyData.data?.DescriptionId
				? this.historyData.data?.DescriptionId
				: this.historyData.data?.Id;
			this.bookingId = this.historyData.data.BookingId;
			this.visitId = this.historyData.data.VisitId
				? this.historyData.data.VisitId
				: this.historyData.data.BookingId;
			this.bookType = this.historyData.classType;
			this.submitValue = this.historyData?.data?.SubmitValue
				? this.historyData?.data?.SubmitValue
				: 0;
			if (
				this.bookType == Constants.CLASS_TYPE_APPOINTMENT ||
				this.bookType == Constants.CLASS_LABEL_APPOINTMENT
			) {
				this.type = Constants.FORM_TYPE_APPOINTMENT;
			} else if (
				this.bookType == Constants.CLASS_TYPE_CLASS ||
				this.bookType == Constants.CLASS_TYPE_GROUP ||
				this.bookType == Constants.CLASS_LABEL_GROUP ||
				this.bookType == Constants.CLASS_LABEL_CLASS
			) {
				this.type = Constants.FORM_TYPE_CLASS;
			}

			this.isLoading = true;
			this.loadData();
		} else {
			this.goBack();
		}
	}

	private loadData(): void {
		this.chronoFormService
			.getList(`${this.type}/${this.id}`)
			.pipe(takeWhile(() => this.alive))
			.subscribe((result: any) => {
				if (!result.msg) {
					this.formList = result;
					if (this.formList[this.formList.length - 1]) {
						this.lastChecked =
							this.formList[this.formList.length - 1].isValid;
						this.isLoading = false;
					} else {
						this.lastChecked = true;
						if (this.submitValue == 0) {
							this.onClientAppt();
						}
					}
				} else {
					this.uiMessagingService.showMessage(result.msg);
					this.router.navigate(['/modules/dashboard']);
				}
			});
	}

	btnClicked(form: any) {
		this.historyData.data['SubmitValue'] = 1;
		this.router.navigate(['/modules/client/' + form], {
			state: {
				data: this.historyData,
				appointmentId: this.formList[0].appointmentId
			}
		});
		console.log('dattttta', this.historyData);
	}

	onClick(formId: any) {
		this.clientId = this.appStore.getClientId();
		const dialogRef = this.dialog.open(DialogFormComponent, {
			width: '100%',
			height: '600px',
			data: {
				url: this.jotUrl,
				id: formId,
				clientId: this.clientId,
				visitId: this.visitId ? this.visitId : this.bookingId,
				type: this.historyData.classType,
				visitType: this.id
			},
			disableClose: true
		});
	}

	onClientAppt(): void {
		this.isLoading = true;
		if (
			this.bookType == Constants.CLASS_TYPE_APPOINTMENT ||
			this.bookType == Constants.CLASS_LABEL_APPOINTMENT
		) {
			this.apptJoinService
				.apptCheckin(this.visitId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((item: any) => {
					this.router.navigate(['/modules/dashboard']);
					this.isLoading = false;
				});
		} else {
			this.classJoinService
				.classCheckin(this.visitId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((item: any) => {
					this.router.navigate(['/modules/dashboard']);
					this.isLoading = false;
				});
		}
	}

	goBack(): void {
		// this.location.back();
		if (
			this.bookType == Constants.CLASS_TYPE_APPOINTMENT ||
			this.bookType == Constants.CLASS_LABEL_APPOINTMENT
		) {
			this.router.navigate(['/modules/appt']);
		} else if (
			this.bookType == Constants.CLASS_TYPE_CLASS ||
			this.bookType == Constants.CLASS_LABEL_CLASS
		) {
			this.router.navigate(['/modules/class']);
		} else if (
			this.bookType == Constants.CLASS_TYPE_GROUP ||
			this.bookType == Constants.CLASS_LABEL_GROUP
		) {
			this.router.navigate(['/modules/group']);
		} else {
			this.router.navigate(['/modules/dashboard']);
		}
	}
}
