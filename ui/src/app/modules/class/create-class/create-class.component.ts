import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Logger } from 'src/app/@shared/utils/logger';
import { DatePipe } from '@angular/common';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { Constants } from 'src/app/@shared/utils/constants';
import { LandingClassService } from 'src/app/@core/backend/services/class/landing.service';
import { ServicesService } from 'src/app/@core/backend/services/class/services.service';
import { ClientServicesService } from 'src/app/@core/backend/services/class/client_services.service';
import { CreateClassBookService } from 'src/app/@core/backend/services/class/create-class-book.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSuccessComponent } from 'src/app/@shared/components/dialog-success/dialog-success.component';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { ClassConfigService } from 'src/app/@core/backend/services/admin/classes.service';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { DialogPaymentComponent } from 'src/app/@shared/components/dialog-payment/dialog-payment.component';
import { StripeService } from 'src/app/@core/backend/services/stripe/stripe.service';

@Component({
	selector: 'mw-create-class',
	templateUrl: './create-class.component.html',
	styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent implements OnInit, OnDestroy {
	private alive = true;
	isLoading: boolean = true;
	isReadMore = false;

	stepperOrientation: Observable<StepperOrientation>;

	formGroup: FormGroup;

	bookingId: any;
	classId: any;
	classDescId: any;
	name: any;
	categoryList: any;
	classList: any;
	bookableDates: any[];
	bookableTimes: any[];
	bookableSelectedTimes: any[];
	selectedClassList: any[];
	clientId: any;

	clientServices: any;
	servicePrices: any;
	categoryId: any;
	sessionId: any;
	bookclass: any;
	payclass: any;
	locationId: any;
	startDateTime: any;

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
		private appStore: AppStore,
		private formBuilder: FormBuilder,
		private categoriesService: CategoriesService,
		private servicesService: ServicesService,
		private landingClassService: LandingClassService,
		private clientServicesService: ClientServicesService,
		private createClassBookService: CreateClassBookService,
		private uiMessagingService: UiMessagingService,
		private stripeService: StripeService,
		private router: Router,
		private dialog: MatDialog,
		breakpointObserver: BreakpointObserver,
		public datePipe: DatePipe
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
	get classCtrl() {
		return this.formGroup.get('classCtrl');
	}
	/** Returns a FormArray with the name 'formArray'. */

	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm() {
		this.checkIfRechedule();
		this.clientId = this.appStore;
		this.isLoading = true;
		this.landingClassService
			.type(Constants.CLASS_TYPE_CLASS)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.categoryList = data;
			});

		this.createClassBookService
			.ClassBook()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.classList = data;
				if (this.bookingId) this.onCategoryChange();
				if (this.categoryId) this.onCategoryChange();

				this.isLoading = false;
			});

		this.formGroup = this.formBuilder.group({
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					categoryCtrl: [this.categoryId, Validators.required],
					classCtrl: [this.classDescId, Validators.required]
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
		if (!history.state.data) {
			return;
		}
		this.isLoading = true;
		this.bookingId = history.state.data.bookingId;
		this.categoryId = history.state.data.categoryId;
		this.classDescId = history.state.data.sessionId;

		if (this.categoryId && this.sessionId) {
			this.isLoading = false;
		}
	}

	onCategoryChange(): void {
		this.selectedClassList = this.classList.filter(
			(item: any) => item.CategoryId === this.categoryId
		);
		if (this.selectedClassList.length > 0) {
		} else {
			this.uiMessagingService.showMessage('No Schedule Time Available');
		}
		if (this.bookingId) {
			this.classCtrl?.setValue(this.classDescId);
			this.onClassChange();
		} else if (this.classDescId) {
			this.classCtrl?.setValue(this.classDescId);
			this.onClassChange();
		} else {
			this.classDescId = undefined;
		}
	}

	onClassChange(): void {
		this.isLoading = true;
		this.landingClassService
			.getClassSchedulelist(this.classDescId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (data.length > 0) {
					this.bookableDates = data;
					const today = new Date(this.bookableDates[0].startDate);
					const month = today.getMonth();
					const year = today.getUTCFullYear();
					const day = today.getDate() + 1;
					this.startAt = new Date(year, month, day);
					this.sessionId =
						this.bookableDates[0][
							'ClassDescription.SessionType.Id'
						];
					this.classId = this.bookableDates[0].Id;
					this.selectedDate = new Date(
						this.bookableDates[0].startDate +
							' ' +
							this.bookableDates[0].time
					);
					this.onDateSelect(this.selectedDate);

					this.clientServicesService
						.getClientServiceList(this.classId)
						.pipe(takeWhile(() => this.alive))
						.subscribe((data) => {
							if (
								data.length > 0 ||
								Object.keys(data).length > 0
							) {
								this.clientServices = data.filter(
									(type: any) => type.Remaining > 0
								);
							}
						});

					this.servicesService
						.getServiceList(this.classId)
						.pipe(takeWhile(() => this.alive))
						.subscribe((data) => {
							this.servicePrices = data;
						});
					this.isLoading = false;
				} else {
					this.isLoading = false;
					this.uiMessagingService.showMessage(
						'No Schedule Time Available'
					);
					this.router.navigate(['/modules/class']);
				}
			});
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
		this.bookableSelectedTimes = this.bookableDates.filter(
			(item: any) => item.startDate === this.dt && item.TotalBooked == 0
		);
		this.isAM = this.bookableTimes.filter(
			(item: any) => item.startisAM === true
		);
		this.isNoAM = this.bookableTimes.filter(
			(item: any) => item.startisAM === false
		);
		// if (this.bookableTimes.length > 0) {
		// 	//this.isLoading = false;
		// }
	}

	onTimeSelect(data: any) {
		this.classId = data.Id;
		this.locationId = data['Location.Id'];
		this.startDateTime = data.startDate + ' ' + data.time;
		this.name = data['ClassDescription.Name'];
		this.selectedBooking = data.time;
		this.isChecked = !this.isChecked;
	}

	onPriceSelect(data: any) {
		this.selectedPricing = data;
		if (this.selectedPricing) {
			this.isLoading = false;
		}
	}

	onBookClass() {
		this.isLoading = true;
		this.createClassBookService
			.AddClassBook(this.classId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (!data.Error) {
					this.bookclass = data;
					this.isLoading = false;
					this.router.navigate(['/modules/class']).then();
					const dialogRef = this.dialog.open(DialogSuccessComponent, {
						width: '500px',
						autoFocus: false,
						panelClass: 'mw-appt-section',
						data: { name: this.name, type: 'Your Class' }
					});
				} else {
					this.uiMessagingService.showMessage(data.Error.Message);
					this.router.navigate(['/modules/class']);
				}
			});
	}

	onPayClass() {
		this.isLoading = true;
		const payload = {
			ServiceId: this.selectedPricing.ServiceId,
			Amount: this.selectedPricing.Price,
			BookingId: this.classId,
			LocationId: this.locationId,
			StartDateTime: this.startDateTime,
			StaffId: ''
		};

		this.stripeService
			.payment(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (!data.Error) {
					window.location.href = data['url'];
				} else {
					this.uiMessagingService.showMessage(data.Error.Message);
					this.router.navigate(['/class']);
				}
			});
	}

	onCancel(): void {
		this.router.navigate(['/modules/class']);
	}

	ngOnDestroy(): void {
		this.alive = false;
	}

	onSDate2EDate(startDate: any, endDate: any, day: any) {
		var sDate = new Date(startDate);

		var eDate = new Date(endDate),
			mondays = [];
		sDate.setDate(day);
		Logger.debug(sDate + ' ' + day);
		Logger.debug(eDate + ' ' + day);
		while (sDate.getDay() !== day) {
			sDate.setDate(sDate.getDate() + 1);
		}
		while (sDate <= eDate) {
			mondays.push(
				this.datePipe.transform(new Date(sDate.getTime()), 'yyyy-MM-dd')
			);
			sDate.setDate(sDate.getDate() + 7);
		}
		Logger.debug(mondays);
		return mondays;
	}
}
