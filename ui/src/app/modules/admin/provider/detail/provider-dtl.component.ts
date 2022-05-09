import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ProviderConfigService } from 'src/app/@core/backend/services/admin/providers.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';

@Component({
	selector: 'mw-provider-dtl',
	templateUrl: './provider-dtl.component.html',
	styleUrls: ['./provider-dtl.component.scss']
})
export class ProviderDtlComponent implements OnInit {
	alive: boolean = true;
	isLoading: boolean = true;
	id: any;
	apptData: any;
	description: string;
	name: string;
	pageTitle: string;
	zoomLink: any;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private providerConfigService: ProviderConfigService,
		private uiMessagingService: UiMessagingService
	) {}

	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm(): void {
		if (!history.state.data) {
			this.goBack();
		}

		this.apptData = history.state.data.item;
		const staffId = this.apptData.SK;
		this.isLoading = true;
		if (staffId) {
			this.providerConfigService
				.getProviderConfigDetails(staffId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((result: any) => {
					this.isLoading = false;
					this.populateForm(result);
				});
		} else {
			this.isLoading = false;
			this.name = this.apptData.Name;
			this.id = this.apptData.Id;
			this.description = this.apptData.Bio;
		}
	}

	goBack() {
		this.router.navigate(['modules/admin/providers']);
	}

	private populateForm(data: any): void {
		this.id = data.SK;
		this.name = data.Details.Name;
		this.description = data.Details.Bio;
		this.zoomLink = data.Details.ZoomLink;
	}
	save(): void {
		const payload = {
			id: this.id + '',
			name: this.name,
			zoomlink: this.zoomLink
		};
		this.providerConfigService
			.save(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((result: any) => {
				this.uiMessagingService.showSuccess(
					'Record saved successfully'
				);
			});
	}
}
