import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
	CognitoUserAttribute,
	CognitoUserPool,
	CognitoUser
} from 'amazon-cognito-identity-js';
import { Router } from '@angular/router';
import { Logger } from 'src/app/@shared/utils/logger';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { DialogSuccessComponent } from 'src/app/@shared/components/dialog-success/dialog-success.component';
import { takeWhile } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CreateApptBookService } from 'src/app/@core/backend/services/appointment/create-appts-book.service';
import { AppStore } from 'src/app/@shared/datastores/app-store';

@Component({
	selector: 'mw-verification',
	templateUrl: './verification.component.html',
	styleUrls: ['./verification.component.scss']
})
export class VerificationComponent {
	code: string;
	isLoading: boolean = false;
	private alive = true;
	getTime: any;
	clientId: any;

	constructor(
		private router: Router,
		private uiMessagingService: UiMessagingService,
		public dialog: MatDialog,
		private createApptBookService: CreateApptBookService,
		private appStore: AppStore
	) {}

	Verify(): void {
		this.isLoading = true;
		this.clientId = history.state.data.clientId;
		const poolData = {
			UserPoolId: environment.cognitoUserPoolId,
			ClientId: environment.cognitoAppClientId
		};
		const userPool = new CognitoUserPool(poolData);
		const that = this;
		const userData = {
			Username: history.state.data.userName,
			Pool: userPool
		};

		if (!userData.Username) {
			this.uiMessagingService.showWarn(
				'Username information are required'
			);
			this.isLoading = false;
		} else {
			const cognitoUser = new CognitoUser(userData);
			cognitoUser.confirmRegistration(
				this.code,
				true,
				(err: any, result: any) => {
					if (err) {
						alert('Invalid Verification Code');
						Logger.log(err);
						this.isLoading = false;
						return;
					} else {
						this.isLoading = false;
						this.getTime = history.state.data.consultData;
						this.isLoading = true;
						const payload = {
							serviceId: '100051',
							clientId: this.clientId,
							amount: 0,
							bookingId: this.getTime.datas.sessionId,
							locationId: this.getTime.datas.locationId,
							startDateTime:
								this.getTime.datas.startDate +
								' ' +
								this.getTime.datas.startTime,
							staffId: this.getTime.datas.staffId
						};

						this.createApptBookService
							.AddAppointmentPay(payload)
							.pipe(takeWhile(() => this.alive))
							.subscribe((data) => {
								this.isLoading = false;
								if (!data.Error) {
									this.router
										.navigate(['/modules/dashboard'])
										.then();
									const dialogRef = this.dialog.open(
										DialogSuccessComponent,
										{
											width: '500px',
											autoFocus: false,
											panelClass: 'mw-appt-section',
											data: { type: 'Your Appointment' }
										}
									);
								} else {
									this.uiMessagingService.showMessage(
										data.Error.Message
									);
								}
								Logger.log(result);
								this.router.navigate(['auth']);
							});
					}
				}
			);
		}
	}
	goToSignIn() {
		this.router.navigate(['/auth']);
	}
	sendAgain() {
		const poolData = {
			UserPoolId: environment.cognitoUserPoolId,
			ClientId: environment.cognitoAppClientId
		};
		const userPool = new CognitoUserPool(poolData);
		const that = this;
		const userData = {
			Username: history.state.data.userName,
			Pool: userPool
		};
		const cognitoUser = new CognitoUser(userData);
		cognitoUser.resendConfirmationCode(function (err, res) {
			if (err) {
				that.isLoading = false;
				that.uiMessagingService.showError(
					err.message || JSON.stringify(err)
				);
			} else {
				that.isLoading = false;
				that.uiMessagingService.showMessage(
					'confirmation code has send to ' + userData.Username
				);
				Logger.log('confirmation code has send to' + userData.Username);
			}
		});
	}
}
