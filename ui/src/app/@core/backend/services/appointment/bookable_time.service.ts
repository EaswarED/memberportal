import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BookableTimeApi } from '../../api/appointment/bookable_time.api';

@Injectable()
export class BookableTimeService {
	constructor(private api: BookableTimeApi) {}

	getBookableTimelist(id: number) {
		return this.api.getBookableTimelist(id);
	}
}
