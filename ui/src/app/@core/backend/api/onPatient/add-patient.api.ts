import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class AddPatientApi {
	private readonly apiController: string = 'client/';

	constructor(private api: BaseApi) {}

	addPatient(data: any) {
		return this.api.post(this.apiController + 'patients/add', data);
	}

	addMedication(data: any) {
		return this.api.post(this.apiController + 'medication/add', data);
	}

	addAllergies(data: any) {
		return this.api.post(this.apiController + 'allergy/add', data);
	}

	addProblems(data: any) {
		return this.api.post(this.apiController + 'problem/add', data);
	}

	addPatientForm(data: any) {
		return this.api.post('form/submit', data);
	}
}
