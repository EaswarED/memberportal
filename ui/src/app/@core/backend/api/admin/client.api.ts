import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Util } from 'src/app/@shared/utils/util';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class ClientsApi {
	private readonly apiController: string = 'admin/';

	constructor(private api: BaseApi) {}

	public get(name: any): Observable<any> {
		return this.api.get(this.apiController + `search/${name}`);
	}
}
