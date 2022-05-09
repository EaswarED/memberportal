import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { map, catchError, tap } from 'rxjs/operators';

import { RespData } from '../../../interfaces/shared/ws-data';
import { UiMessagingService } from '../../../../@core/backend/services/shared/ui-messaging.service';
import { Constants } from '../../../../@shared/utils/constants';
import { Logger } from '../../../../@shared/utils/logger';
import { ApiError } from './api-error';

@Injectable()
export class BaseApi {
	constructor(
		private http: HttpClient,
		private uiMessagingService: UiMessagingService
	) {}

	get apiUrl(): string {
		return environment.apiUrl;
	}

	get apiUrlMock(): string {
		return environment.apiUrlMock;
	}

	// checks for specific API errors, logs and throws OWN to prevent 'next' calls in .subscribe(...)
	checkApiError(apiResponse: RespData): any {
		if (apiResponse && apiResponse.status && apiResponse.status.err) {
			if (apiResponse.status.code === Constants.API_STATUS_ERROR) {
				this.uiMessagingService.addErrorStatus(apiResponse.status.err);
				this.uiMessagingService.showError(apiResponse.status.err); // TODO: Why explicit show needed?
				throw new ApiError(apiResponse.status.err);
			} else if (apiResponse.status.code === Constants.API_STATUS_WARN) {
				this.uiMessagingService.addWarningStatus(
					apiResponse.status.msg
				);
				this.uiMessagingService.showWarn(apiResponse.status.msg);
			} else {
				this.uiMessagingService.addSuccessStatus(
					apiResponse.status.msg
				);
				//this.uiMessagingService.showSuccess(apiResponse.status.msg);
			}
		}
	}

	// returns actual data from api response
	mapApiResponse(apiResponse: RespData): any {
		if (!apiResponse.status && !apiResponse.data) {
			// TODO: Did not meet the standard format
			return apiResponse;
		} else {
			return apiResponse.data;
		}
	}

	mapArchiveApiResponse(apiResponse: RespData): boolean {
		if (apiResponse.status && !apiResponse.status.err) {
			// TODO: No error returned
			return true;
		} else {
			return false;
		}
	}

	mapApiError(err: HttpErrorResponse): any {
		this.uiMessagingService.addErrorStatus(err.message);
		this.uiMessagingService.showError(err.message);
		return {};
	}

	// one place ot describe how we handle API errors
	private handleApiError = catchError((err: any) => {
		this.mapApiError(err);
		Logger.fatal(err);
		throw new ApiError('Server Side Issue. Please contact support');
	});

	get(endpoint: string): Observable<any> {
		let apiurl: any;
		if (
			endpoint.startsWith('admin') ||
			endpoint.startsWith('selfcare') ||
			endpoint.startsWith('appointment') ||
			endpoint.startsWith('class') ||
			endpoint.startsWith('site') ||
			endpoint.startsWith('service') ||
			endpoint.startsWith('summary') ||
			endpoint.startsWith('dashboard/') ||
			endpoint.startsWith('client') ||
			endpoint.startsWith('staff') ||
			endpoint.startsWith('appts') ||
			endpoint.startsWith('form')
		) {
			apiurl = this.apiUrl;
		} else {
			apiurl = this.apiUrlMock;
		}
		return this.http.get(`${apiurl}/${endpoint}`, {}).pipe(
			this.handleApiError,
			tap((result: any) => this.checkApiError(result)),
			map((result: RespData) => this.mapApiResponse(result))
		);
	}

	post(endpoint: string, data: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/${endpoint}`, data, {}).pipe(
			this.handleApiError,
			tap((result: any) => this.checkApiError(result)),
			map((result: RespData) => this.mapApiResponse(result))
		);
	}

	archive(endpoint: string): Observable<any> {
		return this.http.delete(`${this.apiUrl}/${endpoint}`, {}).pipe(
			this.handleApiError,
			tap((result: any) => this.checkApiError(result)),
			map((result: RespData) => this.mapArchiveApiResponse(result))
		);
	}
}
