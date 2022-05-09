import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateGroupBookApi } from '../../api/group/create-group-book.api';

@Injectable()
export class CreateGroupBookService {
	constructor(private api: CreateGroupBookApi) {}

	AddGroupBook(data: any) {
		return this.api.AddGroupBook(data);
	}
}
