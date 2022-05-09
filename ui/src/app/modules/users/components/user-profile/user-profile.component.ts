import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import {
	AccountList,
	cities,
	countries
} from '../../../../../assets/mock-data';
import { UserProfileService } from 'src/app/@core/backend/services/users/user-profile.service';
import { UpdateProfileService } from 'src/app/@core/backend/services/users/update-user-profile.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { takeWhile } from 'rxjs/operators';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { environment } from 'src/environments/environment';

import {
	AuthenticationDetails,
	CognitoUser,
	CognitoUserPool
} from 'amazon-cognito-identity-js';
import { Router } from '@angular/router';

@Component({
	selector: 'mw-create-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	hide = true;
	pwhide = true;
	pwdhide = true;
	isShow: boolean = true;
	oldPassword: string = '';
	newPassword: string = '';
	confirmPassword: string = '';
	private alive: boolean = true;
	isLoading: boolean = true;

	countries: Array<any> = countries;
	cities: Array<any> = cities;

	imagePreviewModel: any;
	client_id: any;
	fname: any;
	lname: any;
	gender: any;
	phone: any;
	dob: any;
	wphone: any;
	country: any;
	state: any;
	postal: any;
	email: any;
	doc: any;
	race: any;
	ethin: any;
	lang: any;
	econtact: any;
	address: any;
	city: any;
	contact_per: any;
	photoUrl: any;

	userData: any;
	companyId: any;

	filePath: string;
	accountList = AccountList;
	tabIndex: number = 0;
	historyData: any;
	companyList: any[];
	gridContext: any;
	gridScope = this;
	sendAccountEmails: boolean;
	sendAccountTexts: boolean;
	actionList = [
		{
			icon: 'remove',
			tip: 'Remove',
			action: 'remove'
		}
	];
	getActions(): any[] {
		return this.gridScope.actionList;
	}

	constructor(
		private userProfileService: UserProfileService,
		private appStore: AppStore,
		private updateProfileService: UpdateProfileService,
		private uiMessagingService: UiMessagingService,
		private router: Router
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope
		};
	}

	columnDefs: ColDef[] = [
		{
			headerName: 'Account Name',
			field: 'accountName',
			minWidth: 220
		},
		{
			headerName: 'Billing Schedule',
			field: 'billingSchedule',
			minWidth: 220
		},
		{
			headerName: 'Account Balance',
			field: 'accountBal',
			minWidth: 220
		},
		{
			headerName: 'Default',
			field: 'default',
			minWidth: 220
		},
		{
			headerName: 'Actions',
			cellRenderer: 'gridActions',
			minWidth: 220
		}
	];

	frameworkComponents = {
		gridActions: DataGridActionsComponent
	};

	receiveAction(actionObj: { action: string; data: any }) {
		Logger.debug('TODO: Placeholder action.. use when needed');
	}

	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm(): void {
		this.userProfileService
			.getUserCompanyList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.companyList = data;
			});
		this.client_id = this.appStore.getClientId();
		this.refreshList();
		this.historyData = history.state.data;
		const tabCount = 2;
		this.tabIndex =
			(this.tabIndex + Number(this.historyData.selectedIndex)) % tabCount;
	}
	refreshList() {
		this.userProfileService
			.getUserProfileDetails(this.client_id)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (data) {
					this.isLoading = false;
				}
				this.populateForm(data[0]);
			});
	}
	imagePreview(e: any) {
		let file;
		if (e.target) {
			file = e.target.files[0];
		} else {
			file = this.filePath;
		}

		const reader = new FileReader();
		reader.onload = (file) => {
			this.filePath = reader.result as string;
		};
		reader.readAsDataURL(file);
	}
	onChangeContact(event: any) {
		if (event.value == 'E') {
			this.sendAccountEmails = true;
			this.sendAccountTexts = false;
		} else {
			this.sendAccountEmails = false;
			this.sendAccountTexts = true;
		}
	}
	submitForm() {
		this.isLoading = false;
		const payload = {
			id: this.client_id,
			firstName: this.fname,
			lastName: this.lname,
			gender: this.gender,
			mobilePhone: this.phone,
			birthDate: new Date(this.dob).toLocaleDateString(),
			country: this.country,
			state: this.state,
			postalCode: this.postal,
			photoUrl: this.photoUrl,
			email: this.email,
			addressLine1: this.address,
			city: this.city,
			sendAccountEmails: this.sendAccountEmails,
			sendAccountTexts: this.sendAccountTexts,
			crossRegionalUpdate: false,
			test: false,
			companyId: this.companyId
		};
		this.updateProfileService
			.UpdateProfileUser(payload)
			.subscribe((data) => {
				if (data) {
					this.isLoading = false;
					this.uiMessagingService.showSuccess('Saved Successfully');
					this.refreshList();
				}
			});
	}

	private populateForm(data: any): void {
		let contacts: string = '';
		if (data.SendAccountEmails) {
			contacts = 'E';
		}
		if (data.SendAccountTexts) {
			contacts = 'P';
		}
		this.client_id = data.Id;
		this.fname = data.FirstName;
		this.lname = data.LastName;
		this.gender = data.Gender;
		this.dob = data.BirthDate;
		this.email = data.Email;
		this.phone = data.MobilePhone;
		this.address = data.AddressLine1;
		this.city = data.City;
		this.state = data.State;
		this.country = data.Country;
		this.postal = data.PostalCode;
		this.sendAccountEmails = data.SendAccountEmails;
		this.sendAccountTexts = data.SendAccountTexts;
		this.photoUrl = data.PhotoUrl;
		this.contact_per = contacts;
		if (data.ClientRelationships.length != 0) {
			this.companyId = data.ClientRelationships[0].RelatedClientId
				? data.ClientRelationships[0].RelatedClientId
				: '';
		}
	}
	reset() {
		const poolData = {
			UserPoolId: environment.cognitoUserPoolId,
			ClientId: environment.cognitoAppClientId
		};
		const userPool = new CognitoUserPool(poolData);
		const userData = { Username: this.email, Pool: userPool };
		let cognitoUser = new CognitoUser(userData);
		const that = this;
		if (cognitoUser) {
			cognitoUser.getSession((err: any, session: any) => {
				if (err) {
					that.uiMessagingService.showError('' + err);
				} else {
					cognitoUser.changePassword(
						this.oldPassword,
						this.newPassword,
						function (err, res) {
							if (err) {
								that.uiMessagingService.showError('' + err);
							} else {
								that.uiMessagingService.showSuccess(
									'Password Changed Sucessfully'
								);
							}
						}
					);
				}
			});
		} else {
			alert('user Not Authenticated');
		}
	}
}
