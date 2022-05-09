import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';
import { ClientServiceLookupType } from 'src/app/@core/interfaces/shared/lookup-type';

@Injectable()
export class ClientServiceApi {
	private readonly apiController: string = 'client/';

	constructor(private api: BaseApi) {}

	public getClientServicelist(
		id: any
	): Observable<ClientServiceLookupType[]> {
		return this.api.get(this.apiController + `services/${id}`);
	}
}
