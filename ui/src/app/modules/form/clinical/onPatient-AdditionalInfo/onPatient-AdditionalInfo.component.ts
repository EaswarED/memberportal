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
import { AddOnPatientService } from 'src/app/@core/backend/services/onPatient/add-patient.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { Constants } from 'src/app/@shared/utils/constants';
import { ChronoFormService } from 'src/app/@core/backend/services/form/chrono-form.service';

@Component({
	selector: 'mw-onPatient-AdditionalInfo',
	templateUrl: './onPatient-AdditionalInfo.component.html',
	styleUrls: ['./onPatient-AdditionalInfo.component.scss']
})
export class OnPatientAdditionalInfoComponent implements OnInit {
	stepperOrientation: Observable<StepperOrientation>;
	phqFormGroup: FormGroup;
	selectedDate = new Date();
	selectedTimeSlotIndex = 3;
	alive: boolean = true;
	clientphq: any;
	historyData: any;
	test: any;
	formLength: any;
	clientId: any;
	bookingId: any;
	doctorId = Constants.DOCTOR_ID;
	patientId = Constants.PATIENT_ID;
	templateId = Constants.FORM_PHQ9_ID;

	constructor(
		private _formBuilder: FormBuilder,
		private router: Router,
		private chronoFormService: ChronoFormService,
		private addOnPatientService: AddOnPatientService,
		private appStore: AppStore,
		breakpointObserver: BreakpointObserver
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}

	/** Returns a FormArray with the name 'formArray'. */
	get formArray(): AbstractControl | null {
		return this.phqFormGroup.get('formArray');
	}
	ngOnInit(): void {
		this.initializeForm();
	}
	header: any = [];
	string: any = [];

	initializeForm(): void {
		if (history.state.data != undefined) {
			this.historyData = history.state.data;
			this.clientId = this.appStore.getClientId();
			this.bookingId = this.historyData.data.BookingId;
		}
		this.chronoFormService
			.get(this.templateId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.clientphq = data;
				data.forEach((element: any) => {
					let i = 0;
					if (element.data_type === 'Header') {
						this.header.push(element);
					} else {
						this.string.push(element);
					}
				});
				Logger.debug(this.header + ' ' + this.string);
				this.formLength = this.clientphq.length;
			});
		this.phqFormGroup = this._formBuilder.group({
			formArray: this._formBuilder.array([
				this._formBuilder.group({
					phq_0: [''],
					phq_1: [''],
					phq_2: [''],
					phq_3: [''],
					phq_4: [''],
					phq_5: [''],
					phq_6: [''],
					phq_7: [''],
					phq_8: [''],
					phq_9: [''],
					phq_id_0: [''],
					phq_id_1: [''],
					phq_id_2: [''],
					phq_id_3: [''],
					phq_id_4: [''],
					phq_id_5: [''],
					phq_id_6: [''],
					phq_id_7: [''],
					phq_id_8: [''],
					phq_id_9: [''],
					phq_template_0: [''],
					phq_template_1: [''],
					phq_template_2: [''],
					phq_template_3: [''],
					phq_template_4: [''],
					phq_template_5: [''],
					phq_template_6: [''],
					phq_template_7: [''],
					phq_template_8: [''],
					phq_template_9: ['']
				}),
				this._formBuilder.group({
					phq_11: [''],
					phq_12: [''],
					phq_13: [''],
					phq_14: [''],
					phq_15: [''],
					phq_16: [''],
					phq_17: [''],
					phq_18: [''],
					phq_id_11: [''],
					phq_id_12: [''],
					phq_id_13: [''],
					phq_id_14: [''],
					phq_id_15: [''],
					phq_id_16: [''],
					phq_id_17: [''],
					phq_id_18: [''],
					phq_template_11: [''],
					phq_template_12: [''],
					phq_template_13: [''],
					phq_template_14: [''],
					phq_template_15: [''],
					phq_template_16: [''],
					phq_template_17: [''],
					phq_template_18: ['']
				}),
				this._formBuilder.group({
					phq_20: [''],
					phq_21: [''],
					phq_22: [''],
					phq_23: [''],
					phq_24: [''],
					phq_25: [''],
					phq_26: [''],
					phq_27: [''],
					phq_id_20: [''],
					phq_id_21: [''],
					phq_id_22: [''],
					phq_id_23: [''],
					phq_id_24: [''],
					phq_id_25: [''],
					phq_id_26: [''],
					phq_id_27: [''],
					phq_template_20: [''],
					phq_template_21: [''],
					phq_template_22: [''],
					phq_template_23: [''],
					phq_template_24: [''],
					phq_template_25: [''],
					phq_template_26: [''],
					phq_template_27: ['']
				})
			])
		});
	}
	payloadData: any = [];
	btnClicked(e: any) {
		this.phqFormGroup.value.formArray.forEach((element: any) => {
			for (var i = 0; i <= this.formLength; i++) {
				if (
					element['phq_' + i] &&
					element['phq_id_' + i] &&
					element['phq_template_' + i]
				) {
					this.payloadData.push({
						clinical_note_field: element['phq_id_' + i],
						appointment: this.bookingId,
						clinical_note_template: element['phq_template_' + i],
						doctor: this.doctorId,
						value: element['phq_' + i]
					});
				}
			}
		});

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
