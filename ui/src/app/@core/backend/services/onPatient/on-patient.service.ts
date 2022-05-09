import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OnPatientApi } from '../../api/onPatient/on-patient.api';

@Injectable()
export class OnPatientService {
	constructor(private api: OnPatientApi) {}

	getPersonalInformationList() {
		return this.api.getPersonalInformationList();
	}

	getClientPhqList() {
		return this.api.getClientPhq9List();
	}

	getMedicalInformationList() {
		return this.api.getMedicalInformationList();
	}

	getPatientInformationList() {
		return this.api.getPatientInformationList();
	}
	getPatientMedicationList() {
		return this.api.getPatientMedicationList();
	}
	getPatientAllergiesList() {
		return this.api.getPatientAllergiesList();
	}
	getPatientProblemList() {
		return this.api.getPatientProblemList();
	}
	getPatientTemplateList() {
		return this.api.getPatientTemplateList();
	}
}
