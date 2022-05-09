import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckInApi } from '../../api/checkin/checkin.api';

@Injectable()
export class CheckInService {
	constructor(private api: CheckInApi) {}

	getCheckinList() {
		return this.api.getCheckinList();
	}
}
