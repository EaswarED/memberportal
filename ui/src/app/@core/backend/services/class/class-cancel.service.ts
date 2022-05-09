import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ClassCancelApi } from '../../api/class/class-cancel.api';

@Injectable()
export class ClassCancelService {
	constructor(private api: ClassCancelApi) {}

	AddClassCancel(bookingId: any) {
		return this.api.AddClassCancel(bookingId);
	}
}
