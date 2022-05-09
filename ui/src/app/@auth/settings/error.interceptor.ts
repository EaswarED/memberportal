import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Logger } from '../../@shared/utils/logger';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private router: Router) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		let handled: boolean = false;

		return next.handle(request).pipe(
			retry(1),
			catchError((returnedError) => {
				let errorMessage = null;

				if (returnedError.error instanceof ErrorEvent) {
					errorMessage = `Error: ${returnedError.error.message}`;
				} else if (returnedError instanceof HttpErrorResponse) {
					errorMessage = `Error Status ${returnedError.status}: ${returnedError.error.error} - ${returnedError.error.message}`;
					handled = this.handleServerSideError(returnedError);
				}

				Logger.log(errorMessage ? errorMessage : returnedError);

				if (!handled) {
					if (errorMessage) {
						return throwError(errorMessage);
					} else {
						return throwError('Unexpected problem occurred');
					}
				} else {
					return of(returnedError);
				}
			})
		);
	}

	private handleServerSideError(error: HttpErrorResponse): boolean {
		let handled: boolean = false;

		switch (error.status) {
			case 401:
				Logger.log('Please login again.');
				handled = true;
				break;
			case 403:
				Logger.log('Please login again.');
				handled = true;
				break;
		}

		return handled;
	}
}
