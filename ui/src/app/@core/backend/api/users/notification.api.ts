import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class NotificationApi {
	private readonly apiController: string = 'client/';

	constructor(private api: BaseApi) {}

	public GetNotificationDetails() {
		return this.api.get(this.apiController + 'messages');
	}
}
