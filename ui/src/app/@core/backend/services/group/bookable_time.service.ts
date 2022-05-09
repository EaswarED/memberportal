import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookableTimeApi } from '../../api/group/bookable_time.api';

@Injectable()
export class BookableTimeService {
	constructor(private api: BookableTimeApi) {}

	getScheduleDateList() {
		return this.api.getScheduleDateList();
	}

	// getBookableTimelist() {
	// 	return this.api.getBookableTimelist();
	// }
}
