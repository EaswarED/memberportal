import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OtherServiceApi } from '../../api/group/other-service.api';

@Injectable()
export class OtherService {
	constructor(private api: OtherServiceApi) {}

	getProgramClasslist() {
		return this.api.getProgramClasslist();
	}
}
