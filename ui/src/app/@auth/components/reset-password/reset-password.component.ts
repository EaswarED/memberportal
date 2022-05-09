import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
	AuthenticationDetails,
	CognitoUser,
	CognitoUserPool
} from 'amazon-cognito-identity-js';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'mw-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
	hide = true;
	pwhide = true;
	pwdhide = true;
	isShow: boolean = false;
	oldPassword: string = '';
	newPassword: string = '';
	confirmPassword: string = '';
	code: string = '';
	constructor(
		private router: Router,
		private uiMessagingService: UiMessagingService
	) {}

	ngOnInit(): void {
		if (!history.state.data) {
			return;
		}
		if (history.state.data.type == 'FP') {
			this.isShow = true;
		}
		if (history.state.data.type == 'PR') {
			this.isShow = true;
		}
	}
	reset() {
		const poolData = {
			UserPoolId: environment.cognitoUserPoolId,
			ClientId: environment.cognitoAppClientId
		};

		const userPool = new CognitoUserPool(poolData);
		const userData = {
			Username: history.state.data.userName,
			Pool: userPool
		};
		let cognitoUser = new CognitoUser(userData);
		const that = this;
		if (
			history.state.data.type == 'FP' ||
			history.state.data.type == 'PR'
		) {
			cognitoUser.confirmPassword(this.code, this.newPassword, {
				onSuccess(data) {
					Logger.log(data);
					that.router.navigate(['/auth']);
				},
				onFailure(err) {
					Logger.log(err);
				}
			});
		}
	}
}
