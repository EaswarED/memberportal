import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';
import { StaffLookupType } from '../../../interfaces/shared/lookup-type';

@Injectable()
export class StaffApi {
	private readonly apiController: string = 'staff/';

	constructor(private api: BaseApi) {}

	public getStafflist(): Observable<StaffLookupType[]> {
		return this.api.get(this.apiController + 'staffs');
	}
}
