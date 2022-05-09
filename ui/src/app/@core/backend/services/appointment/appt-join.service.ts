import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApptJoinApi } from '../../api/appointment/appt-join.api';

@Injectable()
export class ApptJoinService {
	constructor(private api: ApptJoinApi) {}

	apptJoin(id: any) {
		return this.api.apptJoin(id);
	}

	apptCheckin(id: any) {
		return this.api.apptCheckin(id);
	}
}
