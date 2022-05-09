import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationApi } from '../../api/users/notification.api';

@Injectable()
export class NotificationService {
	constructor(private api: NotificationApi) {}

	GetNotificationDetails() {
		return this.api.GetNotificationDetails();
	}
}
