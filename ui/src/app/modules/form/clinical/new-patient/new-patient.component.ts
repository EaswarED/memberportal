import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
	selector: 'mw-new-patient',
	templateUrl: './new-patient.component.html',
	styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent {
	// items = Array.from({length: 10}).map((_, i) => `Item #${i}`);
	stepperOrientation: Observable<StepperOrientation>;

	appFormGroup: FormGroup;
	constructor(
		private _formBuilder: FormBuilder,
		private router: Router,
		breakpointObserver: BreakpointObserver
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}
	get formArray(): AbstractControl | null {
		return this.appFormGroup.get('formArray');
	}

	btnClicked() {
		this.router.navigate(['/modules/client'], {
			state: {
				data: {
					personal_information: {
						checked: true
					},
					phq9: {
						checked: true
					},
					medical_info: {
						checked: true
					},
					new_patient: {
						checked: true
					}
				}
			}
		});
	}
}
