import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProgramApi } from '../../api/site/program.api';
import { LookupType } from '../../../interfaces/shared/lookup-type';

@Injectable()
export class ProgramService {
	constructor(private api: ProgramApi) {}

	getApptProgramList(): Observable<LookupType[]> {
		return this.api.getProgramlist('A');
	}

	getClassProgramList(): Observable<LookupType[]> {
		return this.api.getProgramlist('C');
	}
	getGroupProgramList(): Observable<LookupType[]> {
		return this.api.getProgramlist('G');
	}
}
