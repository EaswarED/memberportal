import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../shared/base.api';

@Injectable()
export class ClassServiceApi {
	private readonly apiController: string = 'class/';

	constructor(private api: BaseApi) {}

	public getClasslist() {
		return this.api.get(this.apiController + 'class_name');
	}
}
