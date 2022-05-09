import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { OnlineFormService } from 'src/app/@core/backend/services/admin/form.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { Constants } from 'src/app/@shared/utils/constants';
import { Logger } from 'src/app/@shared/utils/logger';
import { UIUtil } from 'src/app/@shared/utils/ui-util';

@Component({
	selector: 'mw-online-form-detail',
	templateUrl: './online-form-detail.component.html',
	styleUrls: ['./online-form-detail.component.scss']
})
export class OnlineFormDetailComponent implements OnInit {
	alive: any = true;
	isLoading: boolean = true;

	timePeriod = UIUtil.getTimePeriodList();
	selectedPeriod = this.timePeriod[1].code;

	validityM: any;
	item: any;
	name: any;
	id: any;
	type: any;
	pageTitle: string;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<OnlineFormDetailComponent>,
		private onlineFormService: OnlineFormService,
		private router: Router,
		private uiMessagingService: UiMessagingService
	) {}
	ngOnInit(): void {
		this.load_data();
	}
	load_data(): void {
		this.item = this.data.item;
		this.type = this.data.type;
		let id = this.item.SK;
		if (id) {
			if (this.type == Constants.FORM_TYPE_NON_CLINICAL) {
				this.onlineFormService
					.getNonClinicalForm(id)
					.pipe(takeWhile(() => this.alive))
					.subscribe((item: any) => {
						this.populateForm(item);
						this.isLoading = false;
					});
			} else {
				this.onlineFormService
					.getClinicalForm(id)
					.pipe(takeWhile(() => this.alive))
					.subscribe((item: any) => {
						this.populateForm(item);
						this.isLoading = false;
					});
			}
		} else {
			this.id = this.item.id;
			this.name = this.item.Name;
			this.pageTitle = this.name;
			this.validityM = this.item['Details.Validity'];
			this.isLoading = false;
		}
	}

	private populateForm(data: any): void {
		this.id = data.SK;
		this.name = data.Details.Name;
		this.validityM = data.Details.Validity;
		this.pageTitle = this.name;
	}
	doSave() {
		let payload = {
			id: this.id,
			name: this.name,
			validity: this.validityM,
			formType: this.type
		};
		this.isLoading = true;
		this.onlineFormService
			.saveForm(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				if (data) {
					this.isLoading = false;
					this.dialogRef.close();
					this.uiMessagingService.showSuccess('Saved Successfully');
					this.router
						.navigateByUrl('/', {
							skipLocationChange: true
						})
						.then(() => {
							this.router.navigate(['modules/admin/forms']);
						});
				} else {
					Logger.debug('Not created');
				}
			});
	}

	onClosePopup(): void {
		this.dialogRef.close();
	}
}
