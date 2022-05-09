import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStore } from '../../@shared/datastores/app-store';
import { Logger } from 'src/app/@shared/utils/logger';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private appStore: AppStore) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const token = this.appStore.getAuthToken();
		if (token) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`
				}
			});
		}
		return next.handle(request);
	}
}
