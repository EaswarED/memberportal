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
import { Router } from '@angular/router';
import { OnPatientService } from 'src/app/@core/backend/services/onPatient/on-patient.service';
import { AddOnPatientService } from 'src/app/@core/backend/services/onPatient/add-patient.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { Constants } from 'src/app/@shared/utils/constants';

@Component({
	selector: 'mw-medical-info',
	templateUrl: './medical-info.component.html',
	styleUrls: ['./medical-info.component.scss']
})
export class MedicalInformationComponent implements OnInit {
	stepperOrientation: Observable<StepperOrientation>;

	medicalFormGroup: FormGroup;

	MEDICAL_DATA: [] | any = [
		{ position: 1, med_dosage: 'Hydrogen', indication: 1.0079 },
		{ position: 2, med_dosage: 'Helium', indication: 4.0026 }
	];
	medicationColumns: string[] = ['position', 'med_dosage', 'indication'];
	medicationdataSource = this.MEDICAL_DATA;
	alive: boolean = true;
	medicalList: any;
	allergyList: any;
	medicationList: any;
	problemList: any;
	historyData: any;
	medicationsNotes: any;
	allegriesNotes: any;
	problemsNotes: any;
	displayedColumns: string[] = ['name', 'description', 'date_diagnosis'];
	displayedAllegriesColumns: string[] = ['notes', 'reaction'];
	displayedMedicalColumns: string[] = ['name', 'indication'];
	payload: any = [];
	formLength: any;
	payloadData: any = [];
	values: any;
	data_a = {};
	data_p = {};
	data_m = {};
	clientId: any;
	bookingId: any;
	doctorId = Constants.DOCTOR_ID;
	patientId = Constants.PATIENT_ID;
	templateId = Constants.FORM_MEDICAL_INFO_ID;

	constructor(
		private _formBuilder: FormBuilder,
		private router: Router,
		private onPatientService: OnPatientService,
		private addOnPatientService: AddOnPatientService,
		private appStore: AppStore,
		breakpointObserver: BreakpointObserver
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}

	get formArray(): AbstractControl | null {
		return this.medicalFormGroup.get('formArray');
	}
	ngOnInit(): void {
		this.initializeForm();
	}
	initializeForm(): void {
		if (history.state.data != undefined) {
			Logger.debug('from PHQ9 ' + history.state.data);
			this.historyData = history.state.data;
			this.clientId = this.appStore.getClientId();
			this.bookingId = this.historyData.BookingId;
		}
		this.medicalFormGroup = this._formBuilder.group({
			formArray: this._formBuilder.array([
				this._formBuilder.group({
					problems: [''],
					allegries: [''],
					medication: ['']
				}),
				this._formBuilder.group({
					visit_0: [''],
					visit_id_0: [''],
					visit_template_0: [''],
					visit_1: [''],
					visit_id_1: [''],
					visit_template_1: [''],
					visit_2: [''],
					visit_id_2: [''],
					visit_template_2: [''],
					visit_3: [''],
					visit_id_3: [''],
					visit_template_3: [''],
					visit_4: [''],
					visit_id_4: [''],
					visit_template_4: [''],
					visit_5: [''],
					visit_id_5: [''],
					visit_template_5: ['']
				})
			])
		});

		this.onPatientService
			.getMedicalInformationList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.medicalList = data.results;
				this.formLength = this.medicalList.length;
				Logger.debug(this.medicalList);
			});
		this.onPatientService
			.getPatientAllergiesList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.allergyList = data.results;

				Logger.debug(this.allergyList);
			});

		this.onPatientService
			.getPatientMedicationList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.medicationList = data.results;

				Logger.debug(this.medicationList);
			});

		this.onPatientService
			.getPatientProblemList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.problemList = data.results;
				Logger.debug('Problems ' + this.problemList);
			});
	}

	btnMedicationsClicked() {
		const payload_a = {
			description: 'Food',
			doctor: this.doctorId,
			patient: this.patientId,
			appointment: this.bookingId,
			notes: this.allegriesNotes,
			reaction: 'Rashes',
			rxnorm: 'Zest22878',
			snomed_reaction: '25064002'
		};
		const payload_m = {
			doctor: this.doctorId,
			patient: this.patientId,
			appointment: this.bookingId,
			notes: this.medicationsNotes,
			indication: '',
			rxnorm: 'furosemidesolution',
			dosage_quantity: 1
		};
		const payload_p = {
			doctor: this.doctorId,
			patient: this.patientId,
			appointment: this.bookingId,
			icd_code: 'J30.89',
			name: 'Perennial allergic rhinitis with seasonal variation (disorder)',
			notes: this.problemsNotes,
			date_diagnosis: '2018-07-25'
		};
		this.addOnPatientService
			.addMedicalDetails(payload_a, 'A')
			.subscribe((data) => {
				this.data_a = data;
			});
		this.addOnPatientService
			.addMedicalDetails(payload_m, 'M')
			.subscribe((data) => {
				this.data_m = data;
			});
		this.addOnPatientService
			.addMedicalDetails(payload_p, 'P')
			.subscribe((data) => {
				this.data_p = data;
			});
	}

	btnClicked() {
		const visit_reason =
			this.medicalFormGroup.value.formArray[
				this.medicalFormGroup.value.formArray.length - 1
			];

		for (var i = 0; i <= this.formLength; i++) {
			Logger.debug('visit_id_' + i);
			if (
				visit_reason['visit_id_' + i] &&
				visit_reason['visit_template_' + i] &&
				visit_reason['visit_' + i]
			) {
				visit_reason['visit_' + i].forEach((element: any) => {
					this.values = element;
				});
				this.payloadData.push({
					clinical_note_field: visit_reason['visit_id_' + i],
					appointment: 201149876,
					clinical_note_template: visit_reason['visit_template_' + i],
					doctor: this.doctorId,
					value: this.values
				});
			}
		}

		const payload = {
			formId: this.templateId,
			formData: this.payloadData
		};
		this.addOnPatientService
			.addPatientFormDetails(payload)
			.subscribe((data) => {
				if (data.status !== 200) {
					this.router.navigate(['/modules/checkin'], {
						state: {
							data: this.historyData
						}
					});
				} else {
					Logger.debug('While creating Error!!');
				}
			});
	}
}
