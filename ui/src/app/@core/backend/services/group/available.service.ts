import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvailableTimeApi } from '../../api/group/available.api';
@Injectable()
export class AvailableService {
	constructor(private api: AvailableTimeApi) {}

	getAvailableTimeList() {
		return this.api.getAvailableTimelist();
	}
}
