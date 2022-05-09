import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateApptSaleApi } from '../../api/appointment/create-appt-sale.api';

@Injectable()
export class CreateApptSaleService {
	constructor(private api: CreateApptSaleApi) {}

	AddAppointment(data: any) {
		return this.api.AddAppointment(data);
	}
}
