import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassServiceApi } from '../../api/appointment/classes-service.api';

@Injectable()
export class ClassService {
	constructor(private api: ClassServiceApi) {}

	getClasslist() {
		return this.api.getClasslist();
	}
}
