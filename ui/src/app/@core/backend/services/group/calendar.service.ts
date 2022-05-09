import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CalendarApi } from '../../api/group/calendar.api';

@Injectable()
export class CalendarService {
	constructor(private api: CalendarApi) {}

	getCalendarlist() {
		return this.api.getCalendarlist();
	}
}
