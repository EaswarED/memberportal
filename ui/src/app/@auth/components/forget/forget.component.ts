import { Component, OnInit } from '@angular/core';
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
	selector: 'mw-forget',
	templateUrl: './forget.component.html',
	styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
	username: string = '';
	constructor(
		private router: Router,
		private uiMessagingService: UiMessagingService
	) {}

	ngOnInit(): void {}

	forget() {
		const poolData = {
			UserPoolId: environment.cognitoUserPoolId,
			ClientId: environment.cognitoAppClientId
		};

		const userPool = new CognitoUserPool(poolData);
		const userData = { Username: this.username, Pool: userPool };
		let cognitoUser = new CognitoUser(userData);
		cognitoUser.forgotPassword({
			onSuccess: function (result) {
				Logger.debug('call result: ' + result);
			},
			onFailure: function (err) {
				alert(err);
			}
		});
		const data = {
			state: {
				data: {
					userName: cognitoUser.getUsername(),
					type: 'FP'
				}
			}
		};
		this.router.navigate(['/auth/reset'], data);
	}
	goToRegister() {
		this.router.navigate(['/auth/register']);
	}
}
