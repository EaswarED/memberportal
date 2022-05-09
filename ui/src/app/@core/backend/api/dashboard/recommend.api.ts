import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';
import { CardItem } from 'src/app/@shared/interfaces/card.interface';

@Injectable()
export class RecommendApi {
	private readonly apiController: string = 'dashboard/recommend/';

	constructor(private api: BaseApi) {}

	getRecommendedApptList(): Observable<CardItem[]> {
		return this.api.get(this.apiController + 'appts');
	}

	getRecommendedClassList(): Observable<CardItem[]> {
		return this.api.get(this.apiController + 'classes');
	}

	getRecommendedGroupList(): Observable<CardItem[]> {
		return this.api.get(this.apiController + 'groups');
	}
}
