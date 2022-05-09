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
import { Location } from '@angular/common';

@Component({
	selector: 'mw-phq',
	templateUrl: './phq.component.html',
	styleUrls: ['./phq.component.scss']
})
export class PhqComponent implements OnInit {
	stepperOrientation: Observable<StepperOrientation>;
	phqFormGroup: FormGroup;
	selectedDate = new Date();
	selectedTimeSlotIndex = 3;
	alive: boolean = true;
	clientphq: any;
	clientfan: any;
	clientgad: any;
	historyData: any;
	test: any;
	phqformLength: any;
	gadformLength: any;
	fanformLength: any;
	clientId: any;
	appointmentId: any;
	bookingId: any;
	doctorId = Constants.DOCTOR_ID;
	patientId = Constants.PATIENT_ID;
	phq_templateId = Constants.FORM_PHQ9_ID;
	gad_templateId = Constants.FORM_GAD7_ID;
	fan_templateId = Constants.FORM_FAN8_ID;
	payloadData: any = [];
	phqData: any = [];
	fanData: any = [];
	gadData: any = [];
	isLoading: boolean = true;

	constructor(
		private _formBuilder: FormBuilder,
		private router: Router,
		private chronoFormService: ChronoFormService,
		private addOnPatientService: AddOnPatientService,
		private appStore: AppStore,
		private location: Location,
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
			this.appointmentId = history.state.appointmentId;
		}
		this.chronoFormService
			.get(this.phq_templateId)
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
				this.phqformLength = this.clientphq.length;
				this.isLoading = false;
			});

		this.phqFormGroup = this._formBuilder.group({
			phq_0: [''],
			phq_1: [''],
			phq_2: ['', Validators.required],
			phq_3: ['', Validators.required],
			phq_4: ['', Validators.required],
			phq_5: ['', Validators.required],
			phq_6: ['', Validators.required],
			phq_7: ['', Validators.required],
			phq_8: ['', Validators.required],
			phq_9: ['', Validators.required],
			phq_10: ['', Validators.required],
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
			phq_id_10: [''],
			phq_template_0: [''],
			phq_template_1: [''],
			phq_template_2: [''],
			phq_template_3: [''],
			phq_template_4: [''],
			phq_template_5: [''],
			phq_template_6: [''],
			phq_template_7: [''],
			phq_template_8: [''],
			phq_template_9: [''],
			phq_template_10: ['']
		});
	}

	btnClicked(e: any) {
		this.isLoading = true;
		let element = this.phqFormGroup.value;
		for (var i = 0; i <= this.phqformLength; i++) {
			if (
				element['phq_' + i] &&
				element['phq_id_' + i] &&
				element['phq_template_' + i]
			) {
				this.payloadData.push({
					clinical_note_field: element['phq_id_' + i],
					appointment: this.appointmentId,
					clinical_note_template: element['phq_template_' + i],
					doctor: this.doctorId,
					value: element['phq_' + i]
				});
			}
		}

		const payload = {
			formId: this.phq_templateId,
			formData: this.payloadData
		};
		this.addOnPatientService
			.addPatientFormDetails(payload)
			.subscribe((data) => {
				this.isLoading = false;
				this.router.navigate(['/modules/checkin'], {
					state: {
						data: this.historyData
					}
				});
			});
	}

	goBack(): void {
		this.location.back();
	}
}
