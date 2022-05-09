import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../shared/base.api';

@Injectable()
export class CreateClassBookApi {
	private readonly apiController: string = 'class/'; //base path

	constructor(private api: BaseApi) {}

	public AddClassBook(id: any) {
		return this.api.get(this.apiController + `book_class/${id}`);
	}

	public ClassBook() {
		return this.api.get(this.apiController + 'book/classes');
	}

	public GroupBook() {
		return this.api.get(this.apiController + 'book/groups');
	}

	public AddClassPay(data: any) {
		return this.api.post(this.apiController + 'class/pay', data);
	}
}
