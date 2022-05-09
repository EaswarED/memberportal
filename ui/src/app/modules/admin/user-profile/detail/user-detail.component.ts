import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { CompaniesService } from 'src/app/@core/backend/services/admin/company.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { UpdateProfileService } from 'src/app/@core/backend/services/users/update-user-profile.service';
import { UserProfileService } from 'src/app/@core/backend/services/users/user-profile.service';
import { AppStore } from 'src/app/@shared/datastores/app-store';
import { AccountList, cities, countries } from 'src/assets/mock-data';
@Component({
	selector: 'mw-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
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
	clientData: any;

	filePath: string;
	accountList = AccountList;
	tabIndex: number = 0;
	historyData: any;
	companyList: any[];
	gridContext: any;
	gridScope = this;
	sendAccountEmails: boolean;
	sendAccountTexts: boolean;
	constructor(
		private appStore: AppStore,
		private router: Router,
		private companiesService: CompaniesService,
		private userProfileService: UserProfileService,
		private uiMessagingService: UiMessagingService,
		private updateProfileService: UpdateProfileService
	) {}
	ngOnInit(): void {
		this.initializeForm();
	}
	initializeForm(): void {
		if (!history.state.data) {
			this.goBack();
		}
		this.clientData = history.state.data.item;
		const clienId = this.clientData.id;
		if (clienId) {
			this.userProfileService
				.getUserProfileDetails(clienId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((result: any) => {
					this.isLoading = false;
					this.populateForm(result[0]);
				});
		}
		this.companiesService
			.getSelectedList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.companyList = data;
			});
		this.client_id = this.appStore.getClientId();
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
	goBack() {
		this.router.navigate(['modules/admin/users']);
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
	refreshList() {
		// this.userProfileService
		// 	.getUserProfileDetails(this.client_id)
		// 	.pipe(takeWhile(() => this.alive))
		// 	.subscribe((data) => {
		// 		if (data) {
		// 			this.isLoading = false;
		// 		}
		// 		this.populateForm(data[0]);
		// 	});
	}
}
