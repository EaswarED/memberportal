import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceApi } from '../../api/group/service.api';
import { ServiceLookupType } from 'src/app/@core/interfaces/shared/lookup-type';

@Injectable()
export class ServicesService {
	constructor(private api: ServiceApi) {}

	getServiceList(id: any): Observable<ServiceLookupType[]> {
		return this.api.getServicelist(id);
	}
}
