import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CalendarBookConsultApi } from '../../api/bookconsult/calendar-bookconsult.api';

@Injectable()
export class CalendarBookConsultService {
	constructor(private api: CalendarBookConsultApi) {}

	GetCalendarBookConsult() {
		return this.api.GetCalendarBookConsult();
	}
}
