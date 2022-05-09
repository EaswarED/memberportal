import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup
} from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AddOnPatientService } from 'src/app/@core/backend/services/onPatient/add-patient.service';
import { OnPatientService } from 'src/app/@core/backend/services/onPatient/on-patient.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { AppStore } from 'src/app/@shared/datastores/app-store';
@Component({
	selector: 'mw-new-patient',
	templateUrl: './new-patient.component.html',
	styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent implements OnInit {
	stepperOrientation: Observable<StepperOrientation>;

	patientFormGroup: FormGroup;
	historyData: any;
	templateList: any;
	formLength: number;
	payloadData: any = [];
	radio_1: any;
	radio_2: any;
	clientId: any;
	bookingId: any;
	doctorId = 292542;
	templateId = 4256775;

	constructor(
		private router: Router,
		breakpointObserver: BreakpointObserver,
		private addOnPatientService: AddOnPatientService,
		private appStore: AppStore
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}

	ngOnInit(): void {
		this.patientFormGroup = new FormGroup({
			phq_0: new FormControl(['']),
			phq_1: new FormControl(['']),
			phq_2: new FormControl(['']),
			phq_3: new FormControl(['']),
			phq_4: new FormControl(['']),
			phq_5: new FormControl(['']),
			phq_6: new FormControl(['']),
			phq_7: new FormControl(['']),
			phq_8: new FormControl(['']),
			phq_9: new FormControl(['']),
			phq_id_0: new FormControl(['']),
			phq_id_1: new FormControl(['']),
			phq_id_2: new FormControl(['']),
			phq_id_3: new FormControl(['']),
			phq_id_4: new FormControl(['']),
			phq_id_5: new FormControl(['']),
			phq_id_6: new FormControl(['']),
			phq_id_7: new FormControl(['']),
			phq_id_8: new FormControl(['']),
			phq_id_9: new FormControl(['']),
			phq_template_0: new FormControl(['']),
			phq_template_1: new FormControl(['']),
			phq_template_2: new FormControl(['']),
			phq_template_3: new FormControl(['']),
			phq_template_4: new FormControl(['']),
			phq_template_5: new FormControl(['']),
			phq_template_6: new FormControl(['']),
			phq_template_7: new FormControl(['']),
			phq_template_8: new FormControl(['']),
			phq_template_9: new FormControl([''])
		});

		if (history.state.data != undefined) {
			this.historyData = history.state.data;
			this.clientId = this.appStore.getClientId();
			this.bookingId = this.historyData.BookingId;
		}
	}

	btnClicked() {
		const element = this.patientFormGroup.value;
		for (var i = 0; i <= this.formLength; i++) {
			if (
				element['phq_' + i] &&
				element['phq_id_' + i] &&
				element['phq_template_' + i] &&
				!Array.isArray(element['phq_id_' + i]) &&
				!Array.isArray(element['phq_template_' + i])
			) {
				const radio_group = 0;
				if (Array.isArray(element['phq_' + i])) {
					element['phq_' + i] = this.radio_1;
				}
				this.payloadData.push({
					clinical_note_field: element['phq_id_' + i],
					appointment: this.bookingId,
					clinical_note_template: element['phq_template_' + i],
					doctor: this.historyData.personal_information.items.doctor,
					value: element['phq_' + i]
				});
			}
		}

		const payload = {
			clientId: this.clientId,
			templateId: this.templateId,
			classId: this.bookingId,
			formData: this.payloadData
		};
		this.addOnPatientService
			.addPatientFormDetails(payload)
			.subscribe((data) => {
				if (data.status !== 200) {
					this.router.navigate(['/modules/client'], {
						state: {
							data: {
								personal_information: {
									checked: true,
									items: this.historyData.personal_information
										.items
								},
								phq9: {
									checked: true,
									items: this.historyData.phq9.items
								},
								medical_info: {
									checked: true,
									items: this.historyData.medical_info.items
								},
								new_patient: {
									checked: true,
									items: data
								}
							}
						}
					});
				} else {
					Logger.debug('While creating Error!!');
				}
			});
	}
}
