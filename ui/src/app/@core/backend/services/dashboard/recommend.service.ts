import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardItem } from 'src/app/@shared/interfaces/card.interface';

import { RecommendApi } from '../../api/dashboard/recommend.api';

@Injectable()
export class RecommendService {
	constructor(private api: RecommendApi) {}

	getRecommendedApptList(): Observable<CardItem[]> {
		return this.api.getRecommendedApptList();
	}

	getRecommendedClassList(): Observable<CardItem[]> {
		return this.api.getRecommendedClassList();
	}

	getRecommendedGroupList(): Observable<CardItem[]> {
		return this.api.getRecommendedGroupList();
	}
}
