import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { StaffLookupType } from '../../../interfaces/shared/lookup-type';
import { StaffApi } from '../../api/staff/staff.api';

@Injectable()
export class StaffService {
	constructor(private api: StaffApi) {}

	getStaffList(): Observable<StaffLookupType[]> {
		return this.api.getStafflist();
	}
}
