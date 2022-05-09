import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassConfigService } from 'src/app/@core/backend/services/admin/classes.service';
import { CompaniesService } from 'src/app/@core/backend/services/admin/company.service';
import { takeWhile } from 'rxjs/operators';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { OnlineFormService } from 'src/app/@core/backend/services/admin/form.service';
import { Constants } from 'src/app/@shared/utils/constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewComponent } from 'src/app/@shared/components/dialog-overview/dialog-overview.component';
import { DialogConfirmComponent } from 'src/app/@shared/components/dialog-confirm/dialog-confirm.component';

@Component({
	selector: 'mw-class-dtl-configuration',
	templateUrl: './class-dtl.component.html',
	styleUrls: ['./class-dtl.component.scss']
})
export class ClassDtlComponent implements OnInit {
	private alive: any = true;
	private id: any;
	isLoading: boolean = true;

	type: string;

	apptData: any;
	name: any;
	description: any;
	categoryId: any;
	categoryList: any;
	url: any;
	gtype: String = '';
	isOpen: '';

	isPublished: boolean = false;
	tabIndex: number = 0;
	nonClinicalFormsList: any;
	savedForms: any[] = [];
	promotion: boolean;
	globalAccess: boolean;

	constructor(
		private router: Router,
		private categoriesService: CategoriesService,
		private ClassConfigService: ClassConfigService,
		private onlineFormService: OnlineFormService,
		private uiMessagingService: UiMessagingService,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm(): void {
		if (!history.state.data) {
			this.onBackAction();
		}
		this.apptData = history.state.data.item.data;
		const classId = this.apptData.SK;
		this.categoriesService
			.getList(Constants.CLASS_TYPE_CLASS)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.categoryList = data;
			});

		this.onlineFormService
			.getNonClinicalForms()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.nonClinicalFormsList = data;
			});
		if (classId) {
			this.ClassConfigService.get(classId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((result: any) => {
					this.isLoading = false;
					this.populateForm(result);
				});
		} else {
			this.name = this.apptData.Name;
			this.id = this.apptData.Id;
			this.description = this.apptData.Description;
			this.isLoading = false;
			this.gtype = '';
			this.isOpen = '';
		}
	}

	onBackAction() {
		this.router.navigate(['modules/admin/classes']);
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

	onGroupChange(): void {
		const dialogRef = this.dialog.open(DialogConfirmComponent, {
			width: '500px',
			autoFocus: false,
			panelClass: 'mw-appt-section',
			data: { type: this.type }
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.gtype = 'O';
				this.categoryId = '';
				this.isOpen = '';
				this.doSave();
				let url;
				if (this.type == 'G') {
					url = '/modules/admin/groups';
					this.router.navigate([url]);
				}
			} else {
				this.type = 'C';
			}
		});
	}

	private populateForm(data: any): void {
		this.id = data.SK;
		this.categoryId = data.Details.CategoryId;
		this.isPublished = data.Details.IsPublished;
		this.savedForms = data.FormsList;
		this.name = data.Details.Name;
		this.type = data.Details.Type;
		this.description = data.Details.Description;
		this.gtype = '';
		this.isOpen = '';
		this.url = data.Details.ZoomUrl;
	}

	onChangePublish($event: any) {
		this.isPublished = $event.checked;
	}

	doSave() {
		const payload = {
			id: this.id + '',
			name: this.name,
			type: this.type ? this.type : Constants.CLASS_TYPE_CLASS,
			categoryId: this.categoryId + '',
			isPublished: this.isPublished,
			formsList: this.savedForms,
			gtype: this.gtype,
			isOpen: this.isOpen,
			zoomUrl: this.url
		};

		Logger.debug(payload);
		if (payload) {
			this.isLoading = true;
			this.ClassConfigService.save(payload)
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
