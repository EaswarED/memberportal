import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	AuthenticationDetails,
	CognitoUser,
	CognitoUserPool,
	CognitoUserSession
} from 'amazon-cognito-identity-js';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { Logger } from 'src/app/@shared/utils/logger';
import { Util } from 'src/app/@shared/utils/util';
import { environment } from 'src/environments/environment';
import { FormControl, Validators } from '@angular/forms';
import { UserProfileService } from 'src/app/@core/backend/services/users/user-profile.service';
import { takeWhile } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'mw-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	lastBuildDt: any;
	username: string = '';
	password: string = '';
	isLoading: boolean = false;
	autoLoginId: number;
	clientId: any;
	clId: any;
	isValid: boolean;
	private alive: boolean = true;

	constructor(
		private router: Router,
		public dialogRef: MatDialogRef<LoginComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private uiMessagingService: UiMessagingService,
		private activatedRoute: ActivatedRoute,
		private appStore: AppStore,
		private userProfileService: UserProfileService
	) {
		let buildDt = environment.buildDt;
		if (buildDt !== 'FILL') {
			this.lastBuildDt = new Date(buildDt);
		}
		const id = this.activatedRoute.snapshot.paramMap.get('id');
		if (id) {
			this.autoLoginId = Util.toInt(id);
		}
	}

	ngOnInit(): void {
		if (!history.state.data) {
			return;
		}
		this.autoLoginId = history.state.data;
		if (this.autoLoginId) {
			this.populateLogin(this.autoLoginId);
			this.handleLogin();
		}
	}
	credentials: any;

	client = [
		{ id: 100000034, client: 'Dev Client 1' },
		{ id: 100000025, client: 'Dev Client 2' },
		{ id: 100000032, client: 'Dev Admin' }
	];

	populateLogin(clientId: any) {
		this.clientId = clientId.value ? clientId.value : clientId;
		if (this.clientId == 100000034) {
			this.username = 'sattvadev2021@gmail.com';
			this.password = 'Test@12345';
		} else if (this.clientId == 100000025) {
			this.username = 'sattvadevsep2021@gmail.com';
			this.password = 'Test@12345';
		} else if (this.clientId == 100000032) {
			this.username = 'sattvadev13@gmail.com';
			this.password = 'Test@12345';
		}
	}
	onChangeEvent(): void {
		this.clientId = undefined;
	}

	forgot() {
		this.router.navigate(['/auth/forgot']);
	}

	register() {
		const data = {
			state: {
				data: this.data
			}
		};
		this.router.navigate(['/auth/register'], data);
	}
	consult() {
		this.router.navigate(['/consult/book']);
	}
	handleLogin(): void {
		if (this.username != '' && this.password != '') {
			this.isLoading = true;
			const authenticationDetails = new AuthenticationDetails({
				Username: this.username,
				Password: this.password
			});
			const poolData = {
				UserPoolId: environment.cognitoUserPoolId,
				ClientId: environment.cognitoAppClientId
			};

			const userPool = new CognitoUserPool(poolData);
			const userData = { Username: this.username, Pool: userPool };
			let cognitoUser = new CognitoUser(userData);
			const that = this;
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: function (
					session: CognitoUserSession,
					userConfirmationNecessary?: boolean
				) {
					// TODO: What is this value???

					that.appStore.handleLogin(session);
					that.clId = that.appStore.getClientId();
					//service call message "Accnt not authorized"
					that.userProfileService
						.getUserProfileDetails(that.clId)
						.pipe(takeWhile(() => that.alive))
						.subscribe((result: any) => {
							if (result[0].ClientRelationships.length == 0) {
								that.isLoading = false;
								that.uiMessagingService.showError(
									'Your account is not authorised'
								);
							} else {
								Logger.log(userConfirmationNecessary);
								that.isLoading = false;
								that.uiMessagingService.showSuccess(
									'Login successful. Please wait...'
								);
								that.data = result;
								// that.router.navigate(['/modules/dashboard']);
								that.dialogRef.close(result);
							}
						});
				},
				onFailure: function (err) {
					if (err.code == 'UserNotConfirmedException') {
						// Resend Confirmation Code To User
						cognitoUser.resendConfirmationCode(function (err, res) {
							if (err) {
								that.isLoading = false;
								that.uiMessagingService.showError(
									err.message || JSON.stringify(err)
								);
							} else {
								that.isLoading = false;
								that.uiMessagingService.showMessage(
									'confirmation code has send to ' +
										that.username
								);
								Logger.log(
									'confirmation code has send to' +
										that.username
								);
							}
						});
						const data = {
							state: {
								data: {
									userName: cognitoUser.getUsername()
								}
							}
						};
						that.isLoading = false;
						that.router.navigate(['/auth/verification'], data);
					} else if (err.code == 'PasswordResetRequiredException') {
						Logger.log('Take the user to reset Paasswor screen');
						const data = {
							state: {
								data: {
									userName: cognitoUser.getUsername(),
									type: 'PR'
								}
							}
						};
						that.isLoading = false;
						that.router.navigate(['/auth/reset'], data);
					} else {
						that.isLoading = false;
						that.uiMessagingService.showError(
							'Invalid login credentials'
						);
					}
				},
				newPasswordRequired: function (
					userAttributes,
					requiredAttributes
				) {
					that.uiMessagingService.showSuccess(
						'Login successful. You will need to reset your password'
					);
					delete userAttributes.email_verified;
					Logger.log(userAttributes);
					Logger.log(requiredAttributes);
				}
			});
		} else {
			this.isLoading = false;
			this.isValid = true;
		}
	}
}
