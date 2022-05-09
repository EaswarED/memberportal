import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateClassBookApi } from '../../api/class/create-class-book.api';

@Injectable()
export class CreateClassBookService {
	constructor(private api: CreateClassBookApi) {}

	AddClassBook(id: any) {
		return this.api.AddClassBook(id);
	}

	ClassBook() {
		return this.api.ClassBook();
	}

	GroupBook() {
		return this.api.GroupBook();
	}

	AddClassPay(data: any) {
		return this.api.AddClassPay(data);
	}
}
