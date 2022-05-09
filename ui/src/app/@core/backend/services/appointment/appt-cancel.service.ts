import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApptCancelApi } from '../../api/appointment/appt-cancel.api';

@Injectable()
export class ApptCancelService {
	constructor(private api: ApptCancelApi) {}

	AddApptCancel(bookingId: any) {
		return this.api.AddApptCancel(bookingId);
	}

	getSummaryCancel(bookingId: number) {
		return this.api.getSummaryCancel(bookingId);
	}
	getReschedule(bookingId: number) {
		return this.api.getReschedule(bookingId);
	}
	AddReschedule(data: any) {
		return this.api.AddReschedule(data);
	}
}
