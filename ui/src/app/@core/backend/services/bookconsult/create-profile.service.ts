import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateProfileApi } from '../../api/bookconsult/create-profile.api';

@Injectable()
export class CreateProfileService {
	constructor(private api: CreateProfileApi) {}

	AddProfile(data: any) {
		return this.api.AddProfileBook(data);
	}
}
