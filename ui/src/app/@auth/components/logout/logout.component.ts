import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { environment } from 'src/environments/environment';
import { Logger } from 'src/app/@shared/utils/logger';
@Component({
	selector: 'mw-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
	private redirectDelay: number = 600;
	constructor(private appStore: AppStore, private router: Router) {}
	ngOnInit(): void {
		this.appStore.handleLogout();

		const poolData = {
			UserPoolId: environment.cognitoUserPoolId,
			ClientId: environment.cognitoAppClientId
		};
		const userPool = new CognitoUserPool(poolData);
		let cognitoUser = userPool.getCurrentUser();
		if (cognitoUser) {
			Logger.log('Cognito Session Exists');
			Logger.log(cognitoUser);
			cognitoUser.signOut();
			// TODO: Call our Logout API
			Logger.log('Call our Logout API');
			setTimeout(() => {
				//return this.router.navigateByUrl('auth/login');
				return this.router.navigate(['auth/login']).then(() => {
					window.location.reload();
				});
			}, this.redirectDelay);
		} else {
			this.router.navigateByUrl('auth/login');
		}
	}
}
