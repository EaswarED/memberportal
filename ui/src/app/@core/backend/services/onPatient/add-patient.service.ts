import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AddPatientApi } from '../../api/onPatient/add-patient.api';

@Injectable()
export class AddOnPatientService {
	constructor(private api: AddPatientApi) {}

	addPatientDetails(data: any) {
		return this.api.addPatient(data);
	}

	addMedicalDetails(data: any, e: any) {
		if (e == 'M') {
			return this.api.addMedication(data);
		} else if (e == 'A') {
			return this.api.addAllergies(data);
		} else {
			return this.api.addProblems(data);
		}
	}
	addPatientFormDetails(data: any) {
		return this.api.addPatientForm(data);
	}
}
