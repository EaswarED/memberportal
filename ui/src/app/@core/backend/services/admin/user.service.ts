import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserApi } from '../../api/admin/user.api';

@Injectable()
export class UserService {
	constructor(private api: UserApi) {}

	getList(): Observable<any> {
		return this.api.getList();
	}
	get(email: any): Observable<any> {
		return this.api.get(email);
	}
	// getSelectedList(): Observable<any> {
	// 	return this.api.getSelectedList();
	// }

	// get(id: any): Observable<any> {
	// 	return this.api.get(id);
	// }

	// save(data: any): Observable<any> {
	// 	return this.api.save(data);
	// }
}
