import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateBookConsultClassApi } from '../../api/bookconsult/book-consult-class.api';

@Injectable()
export class CreateBookConsultClassService {
	constructor(private api: CreateBookConsultClassApi) {}

	AddBookConsultClass(data: any) {
		return this.api.AddBookConsultClass(data);
	}
}
