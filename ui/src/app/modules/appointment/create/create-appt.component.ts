import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SessionService } from 'src/app/@core/backend/services/site/session.service';

import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { StaffService } from 'src/app/@core/backend/services/staff/staff.service';
import { BookableTimeService } from 'src/app/@core/backend/services/appointment/bookable_time.service';
import { ClientServicesService } from 'src/app/@core/backend/services/appointment/client_services.service';
import { ServicesService } from 'src/app/@core/backend/services/appointment/services.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { Constants } from 'src/app/@shared/utils/constants';
import { CreateApptBookService } from 'src/app/@core/backend/services/appointment/create-appts-book.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSuccessComponent } from 'src/app/@shared/components/dialog-success/dialog-success.component';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { DialogPaymentComponent } from 'src/app/@shared/components/dialog-payment/dialog-payment.component';
import { StripeService } from 'src/app/@core/backend/services/stripe/stripe.service';
import { ApptCancelService } from 'src/app/@core/backend/services/appointment/appt-cancel.service';
import { LandingApptService } from 'src/app/@core/backend/services/appointment/landing.service';

@Component({
	selector: 'mw-create-appt',
	templateUrl: './create-appt.component.html',
	styleUrls: ['./create-appt.component.scss']
})
export class CreateApptComponent implements OnInit, OnDestroy {
	private alive = true;
	isLoading: boolean = true;
	isReadMore = false;
	isLinear: boolean = true;

	stepperOrientation: Observable<StepperOrientation>;

	formGroup: FormGroup;

	bookingId: any;
	private sessionName: string;
	bookAppt: any;
	sessionTypeId: any;
	startDateTime: any;
	clientId: any;
	name: any;
	categoryList: any;
	sessionList: any;
	selectedSessionList: any[];
	fullStaffList: any[];
	bookableList: any[];
	bookableStaffList: any[];
	selectedStaff: any;
	bookableTimeList: any[];
	bookableDates: any[];
	bookableTimes: any[];
	locationId: any;

	clientServices: any;
	servicePrices: any;
	categoryId: any;
	sessionId: any;
	reschedule: any;
	staffId: any;

	selectedBooking: any;
	selectedPricing: any;
	isChecked: boolean = false;
	selectedDate: Date | null;

	paymentType: any;
	nameOnCard: any;
	cardNumber: any;
	expiryCtrl: any;
	cvvCtrl: any;
	priceCtrl: any;
	dt: any;
	isAM: any[];
	isNoAM: any[];
	startAt: Date;

	constructor(
		private formBuilder: FormBuilder,
		private appStore: AppStore,
		private staffService: StaffService,
		private bookableTimeService: BookableTimeService,
		private clientServicesService: ClientServicesService,
		private servicesService: ServicesService,
		private router: Router,
		private datePipe: DatePipe,
		private dialog: MatDialog,
		private landingApptService: LandingApptService,
		private createApptBookService: CreateApptBookService,
		private uiMessagingService: UiMessagingService,
		private stripeService: StripeService,
		private apptCancelService: ApptCancelService,
		breakpointObserver: BreakpointObserver
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}

	get formArray(): AbstractControl | null {
		return this.formGroup.get('formArray');
	}
	get categoryCtrl() {
		return this.formGroup.get('categoryCtrl');
	}
	get sessionCtrl() {
		return this.formGroup.get('sessionCtrl');
	}
	get staffCtrl() {
		return this.formGroup.get('staffCtrl');
	}

	ngOnInit(): void {
		this.initializeForm();
	}

	private initializeForm() {
		this.checkIfRechedule();
		this.clientId = this.appStore.getClientId();
		this.landingApptService
			.type(Constants.CLASS_TYPE_APPOINTMENT)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.categoryList = data;
			});
		this.isLoading = true;
		this.createApptBookService
			.AppointmentBook()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.sessionList = data;
				this.isLoading = false;
				if (this.bookingId) this.onCategoryChange();
				if (this.categoryId) this.onCategoryChange();
			});
		this.staffService
			.getStaffList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.fullStaffList = data;
			});
		this.formGroup = this.formBuilder.group({
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					categoryCtrl: [this.categoryId, Validators.required],
					sessionCtrl: [this.sessionId, Validators.required],
					staffCtrl: [this.staffId, Validators.required]
				}),
				this.formBuilder.group({}),
				this.formBuilder.group({
					priceCtrl: [0]
				}),
				this.formBuilder.group({
					paymentTypeCtrl: ['', Validators.required],
					nameOncardCtrl: ['', Validators.required],
					cardNumberCtrl: ['', Validators.required],
					expiryCtrl: ['', Validators.required],
					cvvCtrl: ['', Validators.required]
				})
			])
		});
	}

	private checkIfRechedule(): void {
		// this.isLoading = true;
		// this.bookingId = 2;
		// this.categoryId = 2;
		// this.sessionId = 214;
		// this.staffId = 100000258;
		if (!history.state.data) {
			return;
		}
		this.isLoading = true;
		this.bookingId = history.state.data.bookingId;
		this.categoryId = history.state.data.categoryId;
		this.sessionId = history.state.data.sessionId;
		this.sessionName = history.state.data.sessionName;
		this.staffId = history.state.data.staffId;
		if (this.categoryId && this.sessionId && this.staffId) {
			this.isLoading = false;
		}
		// TODO: Uncomment this block and call Reschedule API
		/*
		this.sessionService
			.getApptSessionList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.categoryId = data.programId;
				this.sessionId = data.sessionId;
				this.staffId = data.staffId;
			});
		*/
	}

	onCategoryChange(): void {
		this.isLoading = true;
		this.selectedSessionList = this.sessionList.filter(
			(item: any) => item.CategoryId === this.categoryId
		);
		if (this.selectedSessionList.length > 0) {
			this.isLoading = false;
		} else {
			this.isLoading = false;
			this.uiMessagingService.showMessage('No Schedule Time Available');
		}
		if (this.bookingId) {
			this.selectedSessionList.push({
				Id: this.sessionId,
				Name: this.sessionName
			});
			this.sessionCtrl?.setValue(this.sessionId);
			this.onSessionChange();
		} else if (this.sessionId) {
			this.sessionCtrl?.setValue(this.sessionId);
			this.onSessionChange();
		} else {
			this.sessionId = undefined;
		}
	}

	onSessionChange(): void {
		this.isLoading = true;
		if (!this.bookingId) this.staffId = undefined;
		this.selectedStaff = undefined;
		this.bookableDates = this.bookableTimeList = [];

		this.bookableTimeService
			.getBookableTimelist(this.sessionId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any[]) => {
				this.bookableList = data;
				this.bookableStaffList = this.fullStaffList.filter(
					(staffEle: any) => {
						return this.bookableList.find((bookableEle: any) => {
							return staffEle.id === bookableEle.staffId;
						});
					}
				);
				if (this.bookableStaffList.length > 0) {
					this.isLoading = false;
				}
				if (this.bookingId) {
					this.onStaffChange(this.staffId);
					this.isLoading = false;
				}
			});

		// TODO: Requires => 1. API Change to accept Session Type 2. Make Observable
		this.clientServicesService
			.getClientServiceList(this.sessionId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.clientServices = data.filter(
					(type: any) => type.Remaining > 0
				);
			});
		// TODO: Requires => 1. API Change to accept Session Type 2. Make Observable
		this.servicesService
			.getServiceList(this.sessionId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.servicePrices = data;
			});
	}

	onStaffChange(event: any): void {
		this.selectedStaff = null;
		this.staffId = event?.value ? event?.value : event;
		this.selectedStaff = this.bookableStaffList.filter(
			(item: any) => item.id === this.staffId
		)[0];
		this.isLoading = false;
	}

	nxtBtnClicked() {
		this.isLoading = true;

		this.bookableDates = this.bookableList.filter(
			(item: any) => item.staffId === this.staffId
		);
		if (this.bookableDates.length > 0) {
			const today = new Date(this.bookableDates[0].startDate);
			const month = today.getMonth();
			const year = today.getUTCFullYear();
			const day = today.getDate() + 1;
			this.startAt = new Date(year, month, day);
			this.selectedDate = new Date(
				this.bookableDates[0].startDate +
					' ' +
					this.bookableDates[0].time
			);
			this.onDateSelect(this.selectedDate);
			this.isLoading = false;
		}
		this.bookableTimeList = this.bookableDates.filter(
			(bookableEle: any) => {
				return this.fullStaffList.find((staffEle: any) => {
					return staffEle.id === bookableEle.staffId;
				});
			}
		);
	}

	handleMoreLess() {
		this.isReadMore = !this.isReadMore;
	}

	isBookable = (date: Date): boolean => {
		const dt = this.datePipe.transform(date, 'yyyy-MM-dd');
		return this.bookableDates.some((item) => {
			return item.startDate === dt;
		});
	};

	isSelected = (event: any) => {
		return this.isBookable(event) ? 'selected' : '';
	};

	onDateSelect(event: any) {
		this.dt = this.datePipe.transform(event, 'yyyy-MM-dd');
		this.bookableTimes = this.bookableDates.filter(
			(item: any) => item.startDate === this.dt
		);
		this.isAM = this.bookableTimes.filter(
			(item: any) => item.startisAM === true
		);
		this.isNoAM = this.bookableTimes.filter(
			(item: any) => item.startisAM === false
		);
		if (this.bookableTimes.length > 0) {
			this.isLoading = false;
		}
	}

	onTimeSelect(data: any) {
		this.sessionTypeId = data.sessionId;
		this.locationId = data.locationId;
		this.name = data.name;
		this.startDateTime = data.startDate + ' ' + data.startTime;
		this.selectedBooking = data.startTime;
		this.name = data.SessionName;
		this.isChecked = !this.isChecked;
	}

	onPriceSelect(data: any) {
		this.selectedPricing = data;
		if (this.selectedPricing) {
			this.isLoading = false;
		}
	}

	onBookAppt() {
		if (this.bookingId) {
			this.isLoading = true;
			const payload = {
				booking_id: this.bookingId,
				startDateTime: this.startDateTime
			};
			this.apptCancelService
				.AddReschedule(payload)
				.pipe(takeWhile(() => this.alive))
				.subscribe((data) => {
					if (!data.Error) {
						this.bookAppt = data;
						this.isLoading = false;
						this.router.navigate(['/modules/appt']).then();
						const dialogRef = this.dialog.open(
							DialogSuccessComponent,
							{
								width: '500px',
								autoFocus: false,
								panelClass: 'mw-appt-section',
								data: {
									name: this.name,
									type: 'Your Appointment'
								}
							}
						);
					} else {
						this.uiMessagingService.showMessage(data.Error.Message);
						this.router.navigate(['/modules/appt']);
					}
				});
		} else {
			this.isLoading = true;
			const payload = {
				bookingId: this.sessionTypeId,
				clientId: this.clientId + '',
				locationId: this.locationId,
				startDateTime: this.startDateTime,
				staffId: this.staffId,
				test: false
			};
			this.createApptBookService
				.AddAppointmentBook(payload)
				.pipe(takeWhile(() => this.alive))
				.subscribe((data) => {
					if (!data.Error) {
						this.bookAppt = data;
						this.isLoading = false;
						this.router.navigate(['/modules/appt']).then();
						const dialogRef = this.dialog.open(
							DialogSuccessComponent,
							{
								width: '500px',
								autoFocus: false,
								panelClass: 'mw-appt-section',
								data: {
									name: this.name,
									type: 'Your Appointment'
								}
							}
						);
					} else {
						this.uiMessagingService.showMessage(data.Error.Message);
						this.router.navigate(['/modules/appt']);
					}
				});
		}
	}

	onPayAppt() {
		this.isLoading = true;
		const payload = {
			ServiceId: this.selectedPricing.ServiceId,
			Amount: this.selectedPricing.Price,
			BookingId: this.sessionTypeId,
			LocationId: this.locationId,
			StartDateTime: this.startDateTime,
			StaffId: this.staffId
		};

		this.stripeService
			.payment(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (!data.Error) {
					window.location.href = data['url'];
				} else {
					this.uiMessagingService.showMessage(data.Error.Message);
					this.router.navigate(['/appt']);
				}
			});
	}
	onChangePaymentType(event: any) {
		// if (event.value == 'CC') {
		// 	this.paymentType = 'Credit Card';
		// } else {
		// 	this.paymentType = 'Store Card';
		// }
	}

	onCancel(): void {
		this.router.navigate(['/modules/appt']);
	}

	ngOnDestroy(): void {
		this.alive = false;
	}
}
