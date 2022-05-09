import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UIUtil } from 'src/app/@shared/utils/ui-util';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { CreateApptBookService } from 'src/app/@core/backend/services/appointment/create-appts-book.service';
import { DialogSuccessComponent } from 'src/app/@shared/components/dialog-success/dialog-success.component';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { LoginComponent } from 'src/app/@shared/components/login/login.component';
@Component({
	selector: 'mw-book',
	templateUrl: './book.component.html',
	styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
	@ViewChild('stepper') stepper: MatStepper;

	private alive = true;
	isLoading: boolean = false;
	weeklyDisplay: boolean = true;
	dailyDisplay: boolean = false;
	historyData: any;
	selectedIndexstep: number = 0;
	clientId: number;
	stepperOrientation: Observable<StepperOrientation>;
	bookFormGroup: FormGroup;
	viewPeriod = UIUtil.getPeriodFilterList();
	selectedFilter: number = 1;
	getTime: any;
	name: string | any;
	client_data: any;

	constructor(
		public dialog: MatDialog,
		private appStore: AppStore,
		private _formBuilder: FormBuilder,
		private router: Router,
		private createApptBookService: CreateApptBookService,
		breakpointObserver: BreakpointObserver,
		private uiMessagingService: UiMessagingService
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}

	get formArray(): AbstractControl | null {
		return this.bookFormGroup.get('formArray');
	}

	ngOnInit(): void {
		this.checkIfRechedule();
		this.bookFormGroup = this._formBuilder.group({
			formArray: this._formBuilder.array([
				this._formBuilder.group({}),
				this._formBuilder.group({}),
				this._formBuilder.group({})
			])
		});
	}

	private checkIfRechedule(): void {
		this.historyData = history.state;
		if (this.historyData) {
			const stepCount = 2;
			this.selectedIndexstep =
				(this.selectedIndexstep +
					Number(this.historyData.selectedIndex)) %
				stepCount;
		}
	}

	onPeriodChange(event: any) {
		if (this.selectedFilter == 0) {
			this.weeklyDisplay = false;
			this.dailyDisplay = true;
		} else {
			this.weeklyDisplay = true;
			this.dailyDisplay = false;
		}
	}

	bookConsult(event: any) {
		this.getTime = event;
	}
	onOpenTime(event: any) {
		this.getTime = event;
	}
	nxtClick() {
		if (this.getTime) {
			this.stepper.next();
		} else {
			this.uiMessagingService.showError('Please Select any option');
		}
	}
	cancel() {
		this.router.navigate(['/auth']);
	}
	onBookConsult() {
		const dialogRef = this.dialog.open(LoginComponent, {
			data: this.getTime
		});

		dialogRef.afterClosed().subscribe((result) => {
			this.clientId = this.appStore.getClientId();
			this.client_data = result;
			if (this.client_data) {
				this.isLoading = true;
				const payload = {
					clientId: this.clientId,
					serviceId: '100051',
					amount: 0,
					bookingId: this.getTime.datas.sessionId,
					locationId: this.getTime.datas.locationId,
					startDateTime:
						this.getTime.datas.startDate +
						' ' +
						this.getTime.datas.startTime,
					staffId: this.getTime.datas.staffId
				};

				this.createApptBookService
					.AddAppointmentPay(payload)
					.pipe(takeWhile(() => this.alive))
					.subscribe((data) => {
						this.isLoading = false;
						if (!data.Error) {
							this.router.navigate(['/modules/dashboard']).then();
							const dialogRef = this.dialog.open(
								DialogSuccessComponent,
								{
									width: '500px',
									autoFocus: false,
									panelClass: 'mw-appt-section',
									data: { type: 'Your Appointment' }
								}
							);
						} else {
							this.uiMessagingService.showMessage(
								data.Error.Message
							);
							this.router.navigate(['/consult/book']);
						}
					});
			}
		});
	}
}
