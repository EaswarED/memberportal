import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
	FormControl
} from '@angular/forms';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable, Subject } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import {
	cities,
	countries,
	races,
	ethinicities,
	languages
} from '../../../../assets/mock-data';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { CreateProfileService } from '../../../@core/backend/services/bookconsult/create-profile.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { environment } from 'src/environments/environment';
import { RegisterProfileService } from 'src/app/@core/backend/services/register/register.service';
import {
	CognitoUserAttribute,
	CognitoUserPool
} from 'amazon-cognito-identity-js';
import { Router } from '@angular/router';
import { AddOnPatientService } from 'src/app/@core/backend/services/onPatient/add-patient.service';
@Component({
	selector: 'mw-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
	maxDate = new Date();
	private alive: boolean = true;
	isLoading: boolean = true;
	stepperOrientation: Observable<StepperOrientation>;
	profileFormGroup: FormGroup;
	passwords = true;
	cpassword = true;
	myControl = new FormControl();
	options: any;
	filteredOptions: Observable<any>;
	selectedIndex: string;
	companyId: any;
	mindBody: any;
	countries: Array<any> = countries;
	cities: Array<any> = cities;
	races: Array<any> = races;
	ethinicities: Array<any> = ethinicities;
	languages: Array<any> = languages;

	fnameCtrl: any;
	lnameCtrl: any;
	dobCtrl: any;
	addressCtrl: any;
	genderCtrl: any;
	raceCtrl: any;
	ethinicityCtrl: any;
	socialSecurityCtrl: any;
	preferredLanguageCtrl: any;
	emergencyPhoneCtrl: any;
	emergencyContactraceCtrl: any;
	emergencyContactCtrl: any;
	drChronoPatientId: any;
	pwdCtrl: any;
	cpwdCtrl: any;
	cityCtrl: any;
	stateCtrl: any;
	countryCtrl: any;
	waiverCtrl: any = false;
	contactCtrl: any;
	postalCtrl: any;
	postalCtrl_int: any;
	emailCtrl: any;
	phoneCtrl: any;
	DOB: any;
	dateOfBirth: any;
	sendAccountEmails: any;
	sendAccountTexts: any;
	selectedItem: any;
	refresh: Subject<any> = new Subject();
	consultData: any;
	@ViewChild('appointmentStepper') stepper: MatStepper;

	passRequirement = {
		passwordMinLowerCase: 1,
		passwordMinNumber: 1,
		passwordMinSymbol: 1,
		passwordMinUpperCase: 1,
		passwordMinCharacters: 8
	};

	pattern = [
		'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
	].join('');

	changeCountry(count: any) {
		this.cities = this.countries.find((con) => con.name == count).cities;
	}

	constructor(
		private _formBuilder: FormBuilder,
		public datepipe: DatePipe,
		private router: Router,
		private uiMessagingService: UiMessagingService,
		private createProfileService: CreateProfileService,
		//private addOnPatientService: AddOnPatientService,
		private registerProfileService: RegisterProfileService,
		breakpointObserver: BreakpointObserver
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}
	/** Returns a FormArray with the name 'formArray'. */
	get formArray(): AbstractControl | null {
		return this.profileFormGroup.get('formArray');
	}

	ngOnInit(): void {
		if (history.state.data) {
			this.consultData = history.state.data;
		}
		this.initialForm();
	}

	initialForm() {
		this.registerProfileService
			.getUserCompanyList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.isLoading = false;
				this.options = data;
				this.refresh.next();
			});
		this.profileFormGroup = this._formBuilder.group({
			formArray: this._formBuilder.array([
				this._formBuilder.group({
					givenName: ['', Validators.required],
					familyname: ['', Validators.required],
					gender: ['', Validators.required],
					birthdate: ['', Validators.required],
					password: [
						'',
						[Validators.required, Validators.pattern(this.pattern)]
					],
					cpassword: ['', Validators.required],
					phonenumber: ['', Validators.required],
					email: ['', Validators.required],
					address: ['', Validators.required],
					locale: ['', Validators.required],
					'custom:State': ['', Validators.required],
					zoneinfo: ['', Validators.required],
					'custom:PostalCode': ['', Validators.required],
					contact: ['', Validators.required]
				}),
				// this._formBuilder.group({
				// 	raceName: ['', Validators.required],
				// 	ethinicityName: ['', Validators.required],
				// 	socialSecurity: ['', Validators.required],
				// 	preferredLanguage: ['', Validators.required],
				// 	emergencyPhone: ['', Validators.required],
				// 	emergencyContact: ['', Validators.required]
				// }),
				this._formBuilder.group({
					waiver: ['']
				})
			])
		});

		// this.filteredOptions = this.myControl.valueChanges.pipe(
		// 	startWith(''),
		// 	map((value) => this._filter(value))
		// );
	}

	filter() {
		this.isLoading = true;
		if (this.options) {
			this.selectedItem = this.options.filter(
				(option: any) => option['Details.Code'] === this.companyId
			);
			this.isLoading = false;
			if (this.companyId.length > 0) {
				this.goToStep();
			} else {
			}
		}

		// let filterValue = '';
		// this.selectedItem = '';
		// if (typeof value === 'string') {
		// 	filterValue = value.toLowerCase();
		// } else {
		// 	filterValue = value.Name.toLowerCase();
		// }
		// if (this.options) {
		// 	return this.options.filter(
		// 		(option: any) =>
		// 			option.Name.toLowerCase().indexOf(filterValue) === 0
		// 	);
		// }
	}

	goToStep() {
		if (this.selectedItem.length > 0) {
			this.stepper.next();
		}
		if (this.selectedItem.length === 0) {
		}
	}

	getCompanies(event: any) {
		this.selectedItem = event;
	}

	displayFn(value: any) {
		return value ? value.Name : undefined;
	}
	// onSearchCompany($event: any) {
	// 	Logger.debug('onSearchCompany_companyId', $event);
	// }
	onChangeContact(event: any) {
		if (event.value == 'E') {
			this.sendAccountEmails = true;
			this.sendAccountTexts = false;
		} else {
			this.sendAccountEmails = false;
			this.sendAccountTexts = true;
		}
	}

	handleClick() {
		this.createMindbodyUser();
	}

	private createMindbodyUser() {
		this.isLoading = true;
		var x = this.postalCtrl;
		this.postalCtrl_int = +x;
		this.DOB = this.datepipe.transform(
			new Date(this.dobCtrl),
			'yyyy/MM/dd'
		);
		const payload = {
			firstName: this.fnameCtrl,
			lastName: this.lnameCtrl,
			gender: this.genderCtrl,
			birthDate: this.DOB,
			mobilePhone: this.phoneCtrl,
			email: this.emailCtrl,
			addressLine1: this.addressCtrl,
			city: this.cityCtrl,
			state: this.stateCtrl,
			country: this.countryCtrl,
			postalCode: this.postalCtrl_int,
			sendAccountEmails: this.sendAccountEmails,
			sendAccountTexts: this.sendAccountTexts,
			liabilityRelease: this.waiverCtrl,
			test: false
		};
		this.createProfileService
			.AddProfile(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (data) {
					this.mindBody = data[0];
					this.createCognitoUser();
				}
			});
	}

	// private createCronoPatient() {
	// 	this.dateOfBirth = this.datepipe.transform(
	// 		new Date(this.dobCtrl),
	// 		'yyyy-MM-dd'
	// 	);
	// 	const patientpayload = {
	// 		date_of_birth: this.dateOfBirth,
	// 		doctor: 263299,
	// 		email: this.emailCtrl,
	// 		first_name: this.fnameCtrl,
	// 		last_name: this.lnameCtrl,
	// 		gender: this.genderCtrl,
	// 		address: this.addressCtrl,
	// 		country: this.countryCtrl,
	// 		race: this.raceCtrl,
	// 		home_phone: '(+1)' + this.phoneCtrl,
	// 		ethinicity: this.ethinicityCtrl,
	// 		preferred_language: this.preferredLanguageCtrl,
	// 		social_security: '(+1)' + this.socialSecurityCtrl,
	// 		emergency_contact_name: this.emergencyContactCtrl,
	// 		emergency_contact_phone: '(+1)' + this.emergencyPhoneCtrl,
	// 		work_phone: '(+1)' + this.phoneCtrl
	// 	};
	// 	this.addOnPatientService
	// 		.addPatientDetails(patientpayload)
	// 		.pipe(takeWhile(() => this.alive))
	// 		.subscribe((data) => {
	// 			this.drChronoPatientId = data.id;
	// 			this.createCognitoUser();
	// 		});
	// }

	ngOnDestroy(): void {
		this.alive = false;
	}

	private createCognitoUser(): void {
		console.log('this.mindBody.Id', this.mindBody.Id);
		const username = this.emailCtrl;
		const password = this.pwdCtrl;

		const poolData = {
			UserPoolId: environment.cognitoUserPoolId,
			ClientId: environment.cognitoAppClientId
		};

		const userPool = new CognitoUserPool(poolData);

		let attributeList = [
			new CognitoUserAttribute({
				Name: 'email',
				Value: username
			}),
			new CognitoUserAttribute({
				Name: 'birthdate',
				Value: this.DOB
			}),
			new CognitoUserAttribute({
				Name: 'given_name',
				Value: this.fnameCtrl
			}),
			new CognitoUserAttribute({
				Name: 'phone_number',
				Value: '+1' + this.phoneCtrl
			}),
			new CognitoUserAttribute({
				Name: 'family_name',
				Value: this.lnameCtrl
			}),
			new CognitoUserAttribute({
				Name: 'gender',
				Value: this.genderCtrl
			}),
			new CognitoUserAttribute({
				Name: 'address',
				Value: this.addressCtrl
			}),
			new CognitoUserAttribute({
				Name: 'locale',
				Value: this.cityCtrl
			}),
			new CognitoUserAttribute({
				Name: 'zoneinfo',
				Value: this.countryCtrl
			}),
			new CognitoUserAttribute({
				Name: 'custom:MindbodyId',
				Value: this.mindBody.Id
			}),
			new CognitoUserAttribute({
				Name: 'custom:CompanyId',
				Value: this.selectedItem[0].Id
			}),
			new CognitoUserAttribute({
				Name: 'custom:ChronoId',
				Value: '101523915'
			}),
			new CognitoUserAttribute({
				Name: 'custom:State',
				Value: this.stateCtrl
			}),
			new CognitoUserAttribute({
				Name: 'custom:ZipCode',
				Value: this.postalCtrl
			}),
			new CognitoUserAttribute({
				Name: 'custom:SendAccountEmails',
				Value: this.sendAccountEmails.toString()
			}),
			new CognitoUserAttribute({
				Name: 'custom:sendAccountTexts',
				Value: this.sendAccountTexts.toString()
			}),
			new CognitoUserAttribute({
				Name: 'custom:LiabilityRelease',
				Value: this.waiverCtrl.toString()
			})
		];
		userPool.signUp(
			username,
			password,
			attributeList,
			[],
			(err, result) => {
				this.isLoading = false;
				if (err) {
					Logger.log(err);
					this.uiMessagingService.showMessage(err.message);
				} else {
					const data = {
						state: {
							data: {
								userName: result?.user.getUsername(),
								clientId: this.mindBody.Id,
								type: 'UR',
								consultData: this.consultData
							}
						}
					};
					this.router.navigate(['/auth/verification'], data);
					this.uiMessagingService.showSuccess(
						'Email Send SucessFully'
					);
				}
			}
		);
	}

	goToSignIn() {
		this.router.navigate(['/auth']);
	}
}
