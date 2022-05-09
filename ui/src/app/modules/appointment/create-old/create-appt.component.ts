import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { TruncatePipe } from '../../../@shared/pipes/index';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from 'src/app/@core/backend/services/site/programs.service';
import { SessionService } from 'src/app/@core/backend/services/site/session.service';
import { StaffService } from 'src/app/@core/backend/services/staff/staff.service';
import { AvailableService } from 'src/app/@core/backend/services/appointment/available.service';
import { ServicesService } from 'src/app/@core/backend/services/appointment/services.service';
import { DatePipe } from '@angular/common';
import { BookableTimeService } from 'src/app/@core/backend/services/appointment/bookable_time.service';
import { ClientServicesService } from 'src/app/@core/backend/services/appointment/client_services.service';
import {
	ClientServiceLookupType,
	ServiceLookupType
} from 'src/app/@core/interfaces/shared/lookup-type';
import { MatDialog } from '@angular/material/dialog';
import { CreateApptSaleService } from 'src/app/@core/backend/services/appointment/create-appts-sale.service';
import { DialogOverviewComponent } from 'src/app/@shared/components/dialog-overview/dialog-overview.component';
import { CreateApptBookService } from 'src/app/@core/backend/services/appointment/create-appts-book.service';
import { ApptCancelService } from 'src/app/@core/backend/services/appointment/appt-cancel.service';
import { Logger } from 'src/app/@shared/utils/logger';

@Component({
	templateUrl: './create-appt.component.html',
	styleUrls: ['./create-appt.component.scss'],
	providers: [TruncatePipe]
})
export class OldCreateApptComponent implements OnInit {
	stepperOrientation: Observable<StepperOrientation>;
	@ViewChild('stepper') stepper: MatStepper;

	categoryList$: Observable<any>;
	sessionList$: Observable<any>;
	staffList$: Observable<any>;
	availableTime$: Observable<any>;
	clientServices$: Observable<any>;
	serviceprice$: Observable<any>;
	appFormGroup: FormGroup;
	selectedDate = new Date();
	selectedTimeSlotIndex = 3;
	appType = [];
	categoryId: number;
	sessionId: number;
	staffId: number;
	paymentTypeId: any;
	prepaidId: any;
	nameOnCard: any;
	paymentType: any;

	staff: any;
	sessionList: any;
	availableTime: any;
	isEditable: boolean = false;
	clientServices: ClientServiceLookupType[];
	serviceprice: ServiceLookupType[];
	time: string;
	cardNumber: any;
	cvv: any;
	expiry: any;
	priceSection: any;
	bookBTN: boolean = false;
	paybtn: boolean = false;
	alive: boolean = true;
	createdetails: any;
	dates: any = new Date();
	today: any = new Date();
	bookable_time: any;
	dats: string;
	selectedApptDate: string;
	selectedApptTime: any;
	selectedSessionId: any;
	selectedPriceSection: any;
	paymentTypeMethod: boolean;
	maxLenBIO: number = 250;
	selectedLength: number;
	readBTN: boolean = true;
	dateSelected: any = [];
	CardMethodName: string;
	dateTime: any;
	staffList: any;
	disabledSelectedStaffID: boolean;
	disabledSelectedTypeID: boolean;
	disabledSelectedProID: boolean;
	linear: boolean = true;
	paymentTypeMethodBtn: boolean;
	selectedIndexstep: number = 0;
	historyData: any;
	constructor(
		private programService: ProgramService,
		private sessionService: SessionService,
		private staffService: StaffService,
		private availableService: AvailableService,
		private servicesService: ServicesService,
		private clientServicesService: ClientServicesService,
		private bookableTimeService: BookableTimeService,
		private createApptBookService: CreateApptBookService,
		private _formBuilder: FormBuilder,
		private router: Router,
		private dialog: MatDialog,
		public datepipe: DatePipe,
		private createApptSaleService: CreateApptSaleService,
		private apptCancelService: ApptCancelService,
		breakpointObserver: BreakpointObserver
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}
	ngAfterViewInit(): void {
		if (history.state.data != undefined) {
			if (history.state.data.type) {
				const stepCount = 4;
				this.selectedIndexstep =
					(this.selectedIndexstep +
						Number(history.state.data.selecetedIndex)) %
					stepCount;
				Logger.debug(this.selectedIndexstep);

				this.staffId = history.state.data.type.staffId;
				this.disabledSelectedStaffID = true;
				this.staffService.getStaffList().subscribe((data) => {
					this.staff = data.filter(
						(staff: any) => staff.id === this.staffId
					);
					this.staff.forEach((obj: any) => {
						if (obj.bio != null) {
							this.selectedLength = obj.bio.length;
						} else {
							this.selectedLength = 0;
						}
					});
				});
			} else {
				this.staffId = 0;
				this.disabledSelectedStaffID = false;
			}
		}
	}
	/** Returns a FormArray with the name 'formArray'. */
	get formArray(): AbstractControl | null {
		return this.appFormGroup.get('formArray');
	}
	ngOnInit(): void {
		this.initializeForm();
	}
	initializeForm() {
		this.dats = new Date(this.dates).toLocaleDateString();

		Logger.log(this.dats);
		Logger.log(this.dates);
		if (this.dates) {
			this.bookableTimeService.getBookableTimelist().subscribe((data) => {
				this.bookable_time = data.filter(
					(bookable_time: any) =>
						new Date(
							bookable_time.startDate
						).toLocaleDateString() === this.dats
				);
			});
		}
		this.historyData = history.state.data;
		Logger.debug('Appt: ' + this.historyData);
		if (history.state.data != undefined) {
			if (history.state.data.programId) {
				this.categoryId = history.state.data.programId;
				this.disabledSelectedProID = true;
			}

			if (history.state.data.sessionId) {
				this.sessionId = history.state.data.sessionId;
				this.disabledSelectedTypeID = true;
			}

			if (history.state.data.type) {
				if (history.state.data.type.programId) {
					this.categoryId = history.state.data.type.programId;
					this.disabledSelectedProID = true;
				} else {
					this.categoryId = 0;
					this.disabledSelectedProID = false;
				}

				if (history.state.data.type.sessionTypeId) {
					this.sessionId = history.state.data.type.sessionTypeId;
					this.disabledSelectedTypeID = true;
				} else {
					this.sessionId = 0;
					this.disabledSelectedTypeID = false;
				}

				if (history.state.data.type.staffId) {
					this.staffId = history.state.data.type.staffId;
					this.disabledSelectedStaffID = true;
					this.staffService.getStaffList().subscribe((data) => {
						this.staff = data.filter(
							(staff: any) => staff.id === this.staffId
						);
						this.staff.forEach((obj: any) => {
							if (obj.bio != null) {
								this.selectedLength = obj.bio.length;
							} else {
								this.selectedLength = 0;
							}
						});
					});
				} else {
					this.staffId = 0;
					this.disabledSelectedStaffID = false;
				}
			}
		} else {
			this.categoryId = 0;
			this.sessionId = 0;
		}

		Logger.debug(this.categoryId + ', ' + this.sessionId);

		this.categoryList$ = this.programService.getApptProgramList();
		if (this.categoryId) {
			this.sessionService.getApptSessionList().subscribe((data) => {
				this.sessionList = data.filter(
					(type: any) => type.programId === this.categoryId
				);
			});
		}
		if (this.sessionId) {
			this.staffService.getStaffList().subscribe((data) => {
				this.staffList = data;
			});
		}
		this.appFormGroup = this._formBuilder.group({
			formArray: this._formBuilder.array([
				this._formBuilder.group({
					appCatCtrl: [this.categoryId, Validators.required],
					appTypeCtrl: [this.sessionId, Validators.required],
					appProviderCtrl: [this.staffId, Validators.required]
				}),
				this._formBuilder.group({}),
				this._formBuilder.group({
					priceCtrl: ['', Validators.required]
				}),
				this._formBuilder.group({
					paymentTypeCtrl: ['', Validators.required],
					nameOncardCtrl: ['', Validators.required],
					cardNumberCtrl: ['', Validators.required],
					expiryCtrl: ['', Validators.required],
					cvvCtrl: ['', Validators.required]
				})
			])
		});
	}

	timeSlotSelected(index: number, time: string) {
		Logger.debug(index);
		this.selectedTimeSlotIndex = index;
		this.time = time;
		this.clientServicesService.getClientServiceList().subscribe((data) => {
			this.clientServices = data.filter(
				(type: any) => type.id === this.sessionId
			);
		});
		this.servicesService.getServiceList().subscribe((data) => {
			this.serviceprice = data.filter(
				(type: any) => type.id === this.sessionId
			);
		});
	}

	onCategoryChange(event: any) {
		if (this.categoryId) {
			this.sessionService.getApptSessionList().subscribe((data) => {
				this.sessionList = data.filter(
					(type: any) => type.programId === this.categoryId
				);
			});
		}
	}

	onSessionChange(event: any) {
		if (this.sessionId) {
			this.staffService.getStaffList().subscribe((data) => {
				this.staffList = data;
			});
		}
	}

	onStaffChange(event: any) {
		if (this.staffId) {
			this.availableService.getAvailableTimeList().subscribe((data) => {
				Logger.debug(data);
				data.forEach((element: any) => {
					this.dateSelected.push(element);
				});
			});
			this.isSelected;
			this.staffService.getStaffList().subscribe((data) => {
				this.staff = data.filter(
					(staff: any) => staff.id === this.staffId
				);
				this.staff.forEach((obj: any) => {
					if (obj.bio != null) {
						this.selectedLength = obj.bio.length;
					} else {
						this.selectedLength = 0;
					}
				});
			});
		}
	}
	onReadMoreLess(event: any) {
		if (event === 'M') {
			this.maxLenBIO = this.selectedLength;
			this.readBTN = false;
		} else {
			this.maxLenBIO = 250;
			this.readBTN = true;
		}
	}
	onDateChanges(event: any) {
		this.dates = new Date(event);
		this.dats = new Date(event).toLocaleDateString();
		if (this.dates) {
			this.bookableTimeService.getBookableTimelist().subscribe((data) => {
				this.bookable_time = data.filter(
					(bookable_time: any) =>
						new Date(
							bookable_time.startDate
						).toLocaleDateString() === this.dats
				);
				Logger.debug(this.bookable_time);
			});

			this.bookableTimeService.getBookableTimelist().subscribe((data) => {
				Logger.debug('Staff Date: ' + data);
				data.forEach((element: any) => {
					// this.dateSelected.push(element);
				});
			});
		}
	}
	onCancelAppt(): void {
		this.router.navigate(['/appointments']);
	}
	onCreateApptBTN(event: any) {
		Logger.debug('Created Payment');
		var x = this.cardNumber;
		var cardNumber_int: number = +x;
		let payload = {};
		Logger.debug(this.CardMethodName);
		if (this.CardMethodName === 'CreditCardOnFile') {
			Logger.debug('CCONFILKE');
		}
		Logger.debug(payload);
		this.createApptSaleService.AddAppointment(payload).subscribe((data) => {
			Logger.debug('Sale payment:' + data);
			if (data.status !== 200) {
				this.router.navigate(['/appointments']).then();
				const dialogRef = this.dialog.open(DialogOverviewComponent, {
					width: '500px',
					autoFocus: false,
					panelClass: 'mw-appt-section',
					data: { name: 'CreateAppt' }
				});

				dialogRef.afterClosed().subscribe((result) => {
					Logger.debug('The dialog was closed');
				});
			} else {
				Logger.debug('While creating Error!!');
			}
		});
		if (this.historyData.cancel) {
			const payload_cancel = {
				AppointmentId: this.historyData.type.appointmentId,
				Execute: 'LateCancel',
				Test: false
			};
			this.apptCancelService
				.AddApptCancel(payload_cancel)
				.subscribe((data) => {
					Logger.debug('success: ' + data);
				});
		} else {
		}
	}
	onCreateBookApptBTN(event: any) {
		Logger.debug('Created Appt Book');
		Logger.debug(this.dats + ' ' + this.time);
		this.dateTime = new Date(this.dats + ' ' + this.time);
		this.dateTime = this.datepipe.transform(
			this.dateTime,
			'yyyy-MM-dd hh:mm'
		);
		Logger.debug(this.dateTime);
		const payload = {
			ClientId: 100015625,
			LocationId: 1,
			SessionTypeId: this.sessionId,
			StaffId: 100000258,
			StartDateTime: '2021-11-10 10:00',
			Test: false
		};

		this.createApptBookService
			.AddAppointmentBook(payload)
			.subscribe((data) => {
				Logger.debug(data);
				if (data.status !== 200) {
					this.router.navigate(['/appointments']).then();
					if (this.historyData.cancel) {
						const payload_cancel = {
							AppointmentId: this.historyData.type.appointmentId,
							Execute: 'LateCancel',
							Test: false
						};
						this.apptCancelService
							.AddApptCancel(payload_cancel)
							.subscribe((data) => {
								Logger.debug('success: ' + data);
							});
					} else {
					}
					const dialogRef = this.dialog.open(
						DialogOverviewComponent,
						{
							width: '500px',
							autoFocus: false,
							panelClass: 'mw-appt-section',
							data: { name: 'CreateAppt' }
						}
					);

					dialogRef.afterClosed().subscribe((result) => {
						Logger.debug('The dialog was closed');
					});
				} else {
					Logger.debug('While creating Error!!');
				}
			});
		Logger.debug(this.historyData.type);
	}
	onPriceChange(event: any) {
		if (event === 'prepaid') {
			this.bookBTN = true;
			this.paybtn = false;
		} else {
			this.bookBTN = false;
			this.paybtn = true;
		}
	}

	onGetApptDetails() {
		this.selectedApptDate = this.dats;
		this.selectedApptTime = new Date(this.dats + ' ' + this.time);
		Logger.debug(this.selectedApptTime);
		if (this.categoryId) {
			this.sessionService.getApptSessionList().subscribe((data) => {
				this.selectedSessionId = data.filter(
					(type: any) => type.id === this.sessionId
				);
				Logger.debug(this.selectedSessionId);
			});
		}
		this.selectedPriceSection = this.priceSection;
	}

	onPaymentTypeChange(event: any) {
		if (event === 1) {
			this.paymentTypeMethod = false;
			this.paymentTypeMethodBtn = true;
			this.CardMethodName = 'CreditCardOnFile';
		} else {
			this.paymentTypeMethod = true;
			this.paymentTypeMethodBtn = true;
			this.CardMethodName = 'CreditCard';
		}
	}

	isSelected = (event: any) => {
		const d = new Date();
		d.setDate(d.getDate() - 1);
		const date =
			event.getFullYear() +
			'-' +
			(event.getMonth() + 1) +
			'-' +
			event.getDate();
		Logger.debug(this.dateSelected);
		return this.dateSelected.find(
			(x: any) =>
				new Date(x).toLocaleDateString() ===
				new Date(date).toLocaleDateString() && new Date(x) >= d
		)
			? 'selected'
			: '';
	};
}
