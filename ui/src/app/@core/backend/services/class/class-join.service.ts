import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassJoinApi } from '../../api/class/class-join.api';

@Injectable()
export class ClassJoinService {
	constructor(private api: ClassJoinApi) {}

	classJoin(id: any) {
		return this.api.classJoin(id);
	}

	classCheckin(id: any) {
		return this.api.classCheckin(id);
	}
}
