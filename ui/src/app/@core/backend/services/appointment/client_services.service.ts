import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ClientServiceApi } from '../../api/appointment/client_service.api';
import { ClientServiceLookupType } from 'src/app/@core/interfaces/shared/lookup-type';

@Injectable()
export class ClientServicesService {
	constructor(private api: ClientServiceApi) {}

	getClientServiceList(id: any): Observable<ClientServiceLookupType[]> {
		return this.api.getClientServicelist(id);
	}
}
