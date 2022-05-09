import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApptConfigService } from 'src/app/@core/backend/services/admin/appointment.service';
import { takeWhile } from 'rxjs/operators';
import { OnlineFormService } from 'src/app/@core/backend/services/admin/form.service';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { Constants } from 'src/app/@shared/utils/constants';

@Component({
	selector: 'mw-appointment-dtl-configuration',
	templateUrl: './appointment-dtl.component.html',
	styleUrls: ['./appointment-dtl.component.scss']
})
export class AppointmentDtlComponent implements OnInit {
	private alive: any = true;
	isLoading: boolean = true;

	apptData: any;
	id: string;
	name: any;
	description: any;
	categoryId: any;
	categoryList: any;
	imageUrl: any;
	type: any;

	isPublished: boolean = false;
	formsList: any;
	clinicalFormsList: any;
	nonClinicalFormsList: any;
	savedForms: any[] = [];
	selectedForms: any[] = [];
	tabIndex: number = 0;

	constructor(
		private router: Router,
		private categoriesService: CategoriesService,
		private apptConfigService: ApptConfigService,
		private onlineFormService: OnlineFormService,
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
		const apptId = this.apptData.SK;

		this.categoriesService
			.getList(Constants.CLASS_TYPE_APPOINTMENT)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.categoryList = data;
			});
		this.onlineFormService
			.getClinicalForms()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.clinicalFormsList = data;
			});
		this.onlineFormService
			.getNonClinicalForms()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.nonClinicalFormsList = data;
			});

		if (apptId) {
			this.apptConfigService
				.get(apptId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((result: any) => {
					this.isLoading = false;
					this.populateForm(result);
				});
		} else {
			this.name = this.apptData.SessionName;
			this.id = this.apptData.SessionTypeId;
			this.isLoading = false;
		}
	}

	goBack() {
		this.router.navigate(['modules/admin/appointments']);
	}

	onFormChange($event: any, data: any): void {
		const formId = data.SK;
		if ($event.checked) {
			this.savedForms.push(formId);
		} else {
			const index = this.savedForms.indexOf(formId);
			if (index >= 0) {
				this.savedForms.splice(index, 1);
			}
		}
	}

	private populateForm(data: any): void {
		this.id = data.SK;
		this.categoryId = data.Details.CategoryId;
		this.isPublished = data.Details.IsPublished;
		this.savedForms = data.FormsList;
		this.name = data.Details.Name;
		this.type = data.Details.type;
		this.imageUrl = data.Details.ImageUrl;
		this.description = data.Details.Description;
	}

	onChangePublish($event: any) {
		this.isPublished = $event.checked;
	}

	doSave() {
		const payload = {
			id: this.id + '',
			name: this.name,
			categoryId: this.categoryId + '',
			isPublished: this.isPublished,
			formsList: this.savedForms,
			imageUrl: this.imageUrl,
			description: this.description
		};
		Logger.log(payload);

		if (payload) {
			this.isLoading = true;
			this.apptConfigService
				.save(payload)
				.pipe(takeWhile(() => this.alive))
				.subscribe((data) => {
					this.isLoading = false;
					if (data) {
						this.uiMessagingService.showSuccess(
							'Saved Successfully'
						);
					}
				});
		}
	}
}
