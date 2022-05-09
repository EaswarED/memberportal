import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileApi } from '../../api/users/user-profile.api';

@Injectable()
export class RegisterProfileService {
	constructor(private api: UserProfileApi) {}

	getUserCompanyList() {
		return this.api.getUserCompanyList();
	}
}
