import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesService } from 'src/app/@core/backend/services/admin/company.service';
import { takeWhile } from 'rxjs/operators';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';

@Component({
	selector: 'mw-admin-company-dtl',
	templateUrl: './company-dtl.component.html',
	styleUrls: ['./company-dtl.component.scss']
})
export class CompanyDtlComponent implements OnInit, OnDestroy {
	private alive: any = true;
	isLoading: boolean = true;

	id: any;
	companyData: any;
	companyCode: any;

	name: string;
	description: string;
	type: string;
	pageTitle: string;
	email: string;
	address1: string;
	city: string;
	stateCd: string;
	country: string;
	zip: number;
	phone: number;
	phone_ref: boolean;
	email_ref: boolean;
	ref_contact: number;
	data: any;

	constructor(
		private router: Router,
		private companiesService: CompaniesService,
		private uiMessagingService: UiMessagingService
	) {}
	ngOnInit(): void {
		this.initializeForm();
	}

	ngOnDestroy(): void {
		this.alive = false;
	}

	initializeForm() {
		if (!history.state.data) {
			this.goBack();
		}
		this.companyData = history.state.data.item;
		const compId = this.companyData.SK;
		if (compId) {
			this.companiesService
				.get(compId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((result: any) => {
					this.isLoading = false;
					this.populateForm(result);
				});
		} else {
			this.name = this.companyData.Name;
			this.id = this.companyData.Id;
			this.email = this.companyData.Email;
			this.isLoading = false;
		}
	}

	goBack() {
		this.router.navigate(['modules/admin/companies']);
	}

	private populateForm(data: any) {
		this.id = data.SK;
		this.name = data.Details.Name;
		this.companyCode = data.Details.Code;
		this.email = data.Details.Email;
	}
	doSave() {
		const payload = {
			id: this.id + '',
			name: this.name,
			email: this.email,
			code: this.companyCode
		};
		if (payload) {
			this.isLoading = true;
			this.companiesService
				.save(payload)
				.pipe(takeWhile(() => this.alive))
				.subscribe((data) => {
					this.isLoading = false;
					if (data.msg === 'Company code exists') {
						this.uiMessagingService.showWarn(
							'Company code already exists'
						);
					} else {
						this.uiMessagingService.showSuccess(
							'Record saved successfully'
						);
					}
				});
		}
	}
}
