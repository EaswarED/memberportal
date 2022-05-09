import { Injectable } from '@angular/core';

import { Logger } from '../utils/logger';
import { LocalStore } from './local-store';
import { Client } from '../../@core/interfaces/site/client';
import {
	CognitoAccessToken,
	CognitoIdToken,
	CognitoRefreshToken,
	CognitoUserPool,
	CognitoUserSession
} from 'amazon-cognito-identity-js';
import { Util } from '../utils/util';
import { Router } from '@angular/router';
import { Constants } from '../utils/constants';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AppStore {
	private loginSession: CognitoUserSession;
	private authToken: string;
	private client: Client;
	private isAdmin: boolean = false;

	constructor(private localStore: LocalStore, protected router: Router) {
		this.client = this.localStore.getClient();
	}

	public setCurrentClient(data: any): void {
		this.client = data;
		this.localStore.setClient(data);
	}

	public getClient(): Client {
		return this.client;
	}

	public getClientId(): number {
		return Util.toInt(this.client.mindbodyClientId);
	}

	public getClientName(): string {
		return this.client.firstName + ' ' + this.client.lastName;
	}

	public getClientIamge() {
		return this.client.picture;
	}

	public getCognitoSession(): CognitoUserSession {
		if (this.loginSession) return this.loginSession;
		const session = this.localStore.getSession();
		if (session) {
			const epochDate = session.accessToken.payload.exp * 1000;
			const expDate = new Date(epochDate);
			const curDate = new Date();
			if (curDate > expDate) {
				this.handleLogout();
				this.router.navigate(['auth/login']).then(() => {
					window.location.reload();
				});
			}
			const RefreshToken = new CognitoRefreshToken({
				RefreshToken: session.refreshToken
			});
			const IdToken = new CognitoIdToken({
				IdToken: session.idToken.jwtToken
			});
			const AccessToken = new CognitoAccessToken({
				AccessToken: session.accessToken.jwtToken
			});
			const sessionData = {
				IdToken: IdToken,
				AccessToken: AccessToken,
				RefreshToken: RefreshToken
			};
			this.loginSession = new CognitoUserSession(sessionData);
			this.authToken = session.idToken.jwtToken;
			this.client = this.localStore.getClient();
			this.isAdmin =
				this.client.groups?.indexOf(Constants.ADMIN_GROUP_NAME) != -1 &&
				this.client.groups?.indexOf(Constants.ADMIN_GROUP_NAME) !=
					undefined;
		}
		return this.loginSession;
	}

	public getAuthToken(): string {
		return this.authToken;
	}

	public isClientAdmin(): boolean {
		return this.isAdmin;
	}

	public handleLogin(session: CognitoUserSession): void {
		this.loginSession = session;
		const idToken = session.getIdToken();
		const clientData = idToken.payload;
		this.authToken = idToken.getJwtToken();

		this.client = {
			emailAddress: clientData['email'],
			firstName: clientData['given_name'],
			lastName: clientData['family_name'],
			mindbodyClientId: clientData['custom:MindbodyId'],
			chronoPatientId: clientData['custom:ChronoId'],
			groups: clientData['cognito:groups']
		};
		if (this.client.groups) {
			this.isAdmin =
				this.client.groups?.indexOf(Constants.ADMIN_GROUP_NAME) != -1 &&
				this.client.groups?.indexOf(Constants.ADMIN_GROUP_NAME) !=
					undefined;
		}
		this.localStore.setClient(this.client);
		this.localStore.setSession(this.loginSession);
	}

	public handleLogout(): void {
		this.localStore.clearSession();
		this.authToken = '';
	}
}
