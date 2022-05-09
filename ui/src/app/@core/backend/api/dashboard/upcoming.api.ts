import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';
import { CardData } from 'src/app/@shared/interfaces/card.interface';

@Injectable()
export class UpcomingApi {
	private readonly apiController: string = 'dashboard/upcoming/';

	constructor(private api: BaseApi) {}

	getUpcomingActivityList(): Observable<CardData[]> {
		return this.api.get(this.apiController + 'activities');
	}
}
