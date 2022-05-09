import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class OnPatientApi {
	private readonly apiController: string = 'patient/';

	constructor(private api: BaseApi) {}

	getPersonalInformationList() {
		return this.api.get(this.apiController + 'personal_info');
	}

	getClientPhq9List() {
		return this.api.get(this.apiController + 'phq9');
	}

	getMedicalInformationList() {
		return this.api.get(this.apiController + 'medical');
	}

	getPatientInformationList() {
		return this.api.get(this.apiController + 'patient');
	}
	getPatientMedicationList() {
		return this.api.get(this.apiController + 'medication');
	}
	getPatientAllergiesList() {
		return this.api.get(this.apiController + 'allergies');
	}

	getPatientProblemList() {
		return this.api.get(this.apiController + 'problems');
	}
	getPatientTemplateList() {
		return this.api.get(this.apiController + 'new');
	}
}
