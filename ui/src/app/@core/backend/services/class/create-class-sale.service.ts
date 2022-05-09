import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateClassSaleApi } from '../../api/class/create-class-sale.api';

@Injectable()
export class CreateClassSaleService {
	constructor(private api: CreateClassSaleApi) {}

	AddClass(data: any) {
		return this.api.AddClass(data);
	}
}
