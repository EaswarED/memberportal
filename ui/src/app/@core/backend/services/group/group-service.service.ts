import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupServiceApi } from '../../api/group/group-service.api';

@Injectable()
export class GroupService {
	constructor(private api: GroupServiceApi) {}

	getGrouplist() {
		return this.api.getGrouplist();
	}
}
