import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';
import { ServiceLookupType } from 'src/app/@core/interfaces/shared/lookup-type';

@Injectable()
export class ServiceApi {
	private readonly apiController: string = 'service/';

	constructor(private api: BaseApi) {}

	public getServicelist(id: any): Observable<ServiceLookupType[]> {
		return this.api.get(this.apiController + `class_prices/${id}`);
	}
}
