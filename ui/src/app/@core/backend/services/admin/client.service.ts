import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientsApi } from '../../api/admin/client.api';

@Injectable()
export class ClientsService {
	constructor(private api: ClientsApi) {}

	get(name: any): Observable<any> {
		return this.api.get(name);
	}
}
