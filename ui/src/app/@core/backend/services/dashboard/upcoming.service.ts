import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardData } from 'src/app/@shared/interfaces/card.interface';

import { UpcomingApi } from '../../api/dashboard/upcoming.api';

@Injectable()
export class UpcomingService {
	constructor(private api: UpcomingApi) {}

	getUpcomingActivityList(): Observable<CardData[]> {
		return this.api.getUpcomingActivityList();
	}
}
