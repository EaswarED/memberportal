import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateApptBookApi } from '../../api/appointment/create-appt-book.api';

@Injectable()
export class CreateApptBookService {
	constructor(private api: CreateApptBookApi) {}

	AddAppointmentBook(data: any) {
		return this.api.AddAppointmentBook(data);
	}

	AddAppointmentPay(data: any) {
		return this.api.AddAppointmentPay(data);
	}

	AppointmentBook() {
		return this.api.AppointmentBook();
	}
}
