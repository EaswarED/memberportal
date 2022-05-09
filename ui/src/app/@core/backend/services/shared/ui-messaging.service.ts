import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface StatusMessage {
	detail: string;
	title: string;
	severity: 'success' | 'info' | 'warn' | 'danger';
}

@Injectable({
	providedIn: 'root'
})
export class UiMessagingService {
	constructor(private toastrService: ToastrService) {}

	private errorStatus = new BehaviorSubject<StatusMessage>({
		detail: 'Test',
		title: 'Summary????',
		severity: 'success'
	});
	readonly errorStatus$: Observable<StatusMessage> =
		this.errorStatus.asObservable();

	showSuccess(text: string) {
		this.toastrService.success(text, 'Success');
	}

	showMessage(text: string) {
		this.toastrService.info(text, 'Information');
	}

	showWarn(text: string) {
		this.toastrService.warning(text, 'Warning');
	}

	showError(text: string) {
		this.toastrService.error(text, 'Error');
	}

	get currentStatus(): StatusMessage {
		return this.errorStatus.value;
	}

	addSuccessStatus(detail: string) {
		this.addStatus(detail, 'Success', 'success');
	}

	addWarningStatus(detail: string) {
		this.addStatus(detail, 'Warning', 'warn');
	}

	addErrorStatus(detail: string) {
		this.addStatus(detail, 'Error', 'danger');
	}

	addStatus(
		detail: string,
		title: string,
		severity: 'success' | 'info' | 'warn' | 'danger'
	) {
		this.errorStatus.next({ detail, title, severity });
	}
}
