import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { OnPatientService } from 'src/app/@core/backend/services/onPatient/on-patient.service';
import { AddOnPatientService } from 'src/app/@core/backend/services/onPatient/add-patient.service';
import { cities, countries } from 'src/assets/mock-data';
import { Logger } from 'src/app/@shared/utils/logger';

@Component({
	selector: 'mw-personal-information',
	templateUrl: './personal-information.component.html',
	styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
	filePath: string;
	myForm: FormGroup;
	personalDetails: any;
	imagePreviewMoodel: any;
	fnameModel: any;
	lnameModel: any;
	genderModel: any;
	phoneModel: any;
	dobModel: any;
	wphoneModel: any;
	countryModel: any;
	stateModel: any;
	postalModel: any;
	emailModel: any;
	docModel: any;
	raceModel: any;
	ethinModel: any;
	langModel: any;
	econtactModel: any;
	econtactpModel: any;
	addressModel: any;
	cityModel: any;

	countries: Array<any> = countries;
	cities: Array<any> = cities;
	constructor(
		public _formBuilder: FormBuilder,
		private router: Router,
		private addOnPatientService: AddOnPatientService,
		private personalInformationService: OnPatientService
	) {
		this.myForm = this._formBuilder.group({
			img: [null],
			filename: ['']
		});
	}

	ngOnInit() {
		this.initializeForm();
	}
	initializeForm(): void {
		this.myForm = new FormGroup({
			imagePreview: new FormControl(),
			fname: new FormControl(['', Validators.required]),
			lname: new FormControl(['', Validators.required]),
			dob: new FormControl(['', Validators.required]),
			gender: new FormControl(['', Validators.required]),
			security: new FormControl(),
			language: new FormControl(),
			race: new FormControl(),
			ethin: new FormControl(),
			phone: new FormControl(['', Validators.required]),
			wphone: new FormControl(),
			email: new FormControl(['', Validators.required]),
			address: new FormControl(['', Validators.required]),
			city: new FormControl(['', Validators.required]),
			state: new FormControl(['', Validators.required]),
			country: new FormControl(['', Validators.required]),
			postal: new FormControl(['', Validators.required]),
			econtact: new FormControl(),
			ephone: new FormControl()
		});
	}

	imagePreview(e: any) {
		const file = e.target.files[0];

		this.myForm.patchValue({
			img: file
		});

		const reader = new FileReader();
		reader.onload = () => {
			this.filePath = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	btnSubmited(e: any) {
		Logger.debug(e);
		var x = this.postalModel;
		var postalModel_int: number = +x;
		var dob =
			new Date(this.dobModel).getFullYear() +
			'-' +
			(new Date(this.dobModel).getMonth() + 1) +
			'-' +
			new Date(this.dobModel).getDate();
		const payload = {
			first_name: this.fnameModel,
			last_name: this.lnameModel,
			gender: this.genderModel,
			home_phone: this.phoneModel,
			date_of_birth: dob,
			work_phone: this.wphoneModel,
			country: this.countryModel,
			state: this.stateModel,
			zip_code: postalModel_int,
			email: this.emailModel,
			doctor: 292542,
			race: 'white',
			ethinicity: this.ethinModel,
			preferred_language: this.langModel,
			// emergencycontact_name: this.econtactModel,
			// emergencycontact_phone: this.econtactpModel,
			address: this.addressModel
		};
		// Logger.debug('payload' + payload);
		this.addOnPatientService
			.addPatientDetails(payload)
			.subscribe((data) => {
				Logger.debug(data);
				if (data.status !== 200) {
					this.router
						.navigate(['/client'], {
							state: {
								data: {
									personal_information: {
										checked: true,
										items: data
									},
									phq9: {
										checked: false,
										items: {}
									},
									medical_info: {
										checked: false,
										items: {}
									},
									new_patient: {
										checked: false,
										items: {}
									}
								}
							}
						})
						.then();
				} else {
					Logger.debug('While creating Error!!');
				}
			});
		Logger.debug(this.imagePreviewMoodel + ' ' + this.fnameModel);
	}
}
