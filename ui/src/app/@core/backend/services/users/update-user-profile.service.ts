import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UpdateProfileApi } from '../../api/users/update-profile.api';

@Injectable()
export class UpdateProfileService {
	constructor(private api: UpdateProfileApi) {}

	UpdateProfileUser(data: any) {
		return this.api.UpdateProfileUser(data);
	}
}
