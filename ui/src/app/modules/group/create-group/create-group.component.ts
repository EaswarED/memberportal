import { Component, OnInit } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/@shared/utils/constants';
import { LandingClassService } from 'src/app/@core/backend/services/class/landing.service';
import { CreateClassBookService } from 'src/app/@core/backend/services/class/create-class-book.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSuccessComponent } from 'src/app/@shared/components/dialog-success/dialog-success.component';
import { GroupConfigService } from 'src/app/@core/backend/services/admin/groups.service';
import { ServicesService } from 'src/app/@core/backend/services/group/services.service';
import { ClientServicesService } from 'src/app/@core/backend/services/group/client_services.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { DialogPaymentComponent } from 'src/app/@shared/components/dialog-payment/dialog-payment.component';
import { StripeService } from 'src/app/@core/backend/services/stripe/stripe.service';

@Component({
	selector: 'mw-create-group',
	templateUrl: './create-group.component.html',
	styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
	private alive = true;
	isLoading: boolean = true;
	isReadMore = false;

	stepperOrientation: Observable<StepperOrientation>;

	formGroup: FormGroup;

	bookingId: any;
	groupId: any;
	groupDescId: any;
	groupData: any;
	name: any;
	categoryList$: Observable<any>;
	groupList: any;
	selectedSessionList: any;
	fullStaffList: any[];
	bookableStaffList: any[];
	selectedStaff: any;
	bookableTimeList: any[];
	bookableDates: any[];
	bookableTimes: any[];
	bookableSelectedTimes: any[];
	selectedGroupList: any[];
	NoShowStepper: boolean = false;

	clientServices: any;
	servicePrices: any;
	categoryId: any;
	sessionId: any;
	bookclass: any;
	payGroup: any;
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
		private formBuilder: FormBuilder,
		private categoriesService: CategoriesService,
		private groupConfigService: GroupConfigService,
		private uiMessagingService: UiMessagingService,
		private landingClassService: LandingClassService,
		private router: Router,
		private servicesService: ServicesService,
		private clientServicesService: ClientServicesService,
		private createClassBookService: CreateClassBookService,
		private dialog: MatDialog,
		public datePipe: DatePipe,
		private stripeService: StripeService,
		breakpointObserver: BreakpointObserver
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}

	get formArray(): AbstractControl | null {
		return this.formGroup.get('formArray');
	}
	/** Returns a FormArray with the name 'formArray'. */
	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm() {
		this.checkIfRechedule();
		this.formGroup = this.formBuilder.group({
			formArray: this.formBuilder.array([
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

		this.isLoading = true;

		this.landingClassService
			.getClassSchedulelist(this.groupDescId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (data.length > 0) {
					this.bookableDates = data;
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
				} else {
					this.isLoading = false;
					this.uiMessagingService.showMessage('No available booking');
					this.router.navigate(['/modules/group']);
				}
			});
	}

	private checkIfRechedule(): void {
		if (!history.state.data) {
			return;
		}
		this.isLoading = true;
		this.bookingId = history.state.data.bookingId;
		this.categoryId = history.state.data.categoryId;
		this.groupDescId = history.state.data.sessionId;
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
		this.isLoading = true;
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
		if (this.bookableTimes.length > 0) {
			this.isLoading = false;
		}
	}

	onTimeSelect(data: any) {
		this.groupId = data.Id;
		this.locationId = data['Location.Id'];
		this.startDateTime = data.startDate + ' ' + data.time;
		this.name = data['ClassDescription.Name'];
		this.selectedBooking = data.time;
		this.isChecked = !this.isChecked;
	}

	nxtBtnClicked() {
		this.isLoading = true;
		this.clientServicesService
			.getClientServiceList(this.groupId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.clientServices = data.filter(
					(type: any) => type.Remaining > 0
				);
			});

		this.servicesService
			.getServiceList(this.groupId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.servicePrices = data;
				this.isLoading = false;
			});
	}

	onPriceSelect(data: any) {
		this.selectedPricing = data;
		if (this.selectedPricing) {
			this.isLoading = false;
		}
	}

	onBookGroup() {
		this.isLoading = true;
		this.createClassBookService
			.AddClassBook(this.groupId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (data) {
					this.bookclass = data;
					this.isLoading = false;
					this.router.navigate(['/modules/group']).then();
					const dialogRef = this.dialog.open(DialogSuccessComponent, {
						width: '500px',
						autoFocus: false,
						panelClass: 'mw-appt-section',
						data: { name: this.name, type: 'Your Group' }
					});
				}
			});
	}

	onPayGroup() {
		this.isLoading = true;
		const payload = {
			ServiceId: this.selectedPricing.ServiceId,
			Amount: this.selectedPricing.Price,
			BookingId: this.groupId,
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
					this.router.navigate(['/group']);
				}
			});
	}

	onCancel(): void {
		this.router.navigate(['/modules/group']);
	}
}
