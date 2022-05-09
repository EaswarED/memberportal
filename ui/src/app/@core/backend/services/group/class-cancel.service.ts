import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GroupCancelApi } from '../../api/group/group-cancel.api';

@Injectable()
export class GroupCancelService {
	constructor(private api: GroupCancelApi) {}

	AddGroupCancel(data: any) {
		return this.api.AddGroupCancel(data);
	}
}
