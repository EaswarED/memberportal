import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserProfileApi } from '../../api/users/user-profile.api';

@Injectable()
export class UserProfileService {
	constructor(private api: UserProfileApi) {}

	getUserProfileDetails(id: any) {
		return this.api.getUserProfileDetails(id);
	}
	getUserCompanyList() {
		return this.api.getUserCompanyList();
	}
}
