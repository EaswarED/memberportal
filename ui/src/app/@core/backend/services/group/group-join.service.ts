import { Injectable } from '@angular/core';
import { GroupJoinApi } from '../../api/group/group-join.api';

@Injectable()
export class GroupJoinService {
	constructor(private api: GroupJoinApi) {}

	groupJoin(id: any) {
		return this.api.groupJoin(id);
	}
}
