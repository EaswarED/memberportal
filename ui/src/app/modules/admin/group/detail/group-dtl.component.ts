import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupConfigService } from 'src/app/@core/backend/services/admin/groups.service';
import { OnlineFormService } from 'src/app/@core/backend/services/admin/form.service';
import { takeWhile } from 'rxjs/operators';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { Constants } from 'src/app/@shared/utils/constants';
import { DialogConfirmComponent } from 'src/app/@shared/components/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { DataGridActionsComponent } from 'src/app/@shared/components/data-grid-actions/data-grid-actions.component';
import { DataGridNameComponent } from 'src/app/@shared/components/data-grid/name/data-grid-name.component';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';

@Component({
	selector: 'mw-group-dtl-configuration',
	templateUrl: './group-dtl.component.html',
	styleUrls: ['./group-dtl.component.scss']
})
export class GroupDtlComponent implements OnInit, OnDestroy {
	private alive: any = true;
	isLoading: boolean = true;
	pendingList$: Observable<any>;
	approvedList$: Observable<any>;
	deniedList$: Observable<any>;

	id: any;
	groupId: any;
	groupData: any;
	name: any;
	description: any;
	categoryId: any;
	categoryList: any;
	isPublished: boolean = false;
	isOpen: boolean = false;
	gridContext: any;
	gridScope = this;

	type: string;
	groupType: string = 'O'; // Open by default

	clinicalFormsList: any;
	nonClinicalFormsList: any;
	savedForms: any[] = [];
	selectedForms: any[] = [];

	columnPendingDefs: ColDef[] = [
		{
			headerName: 'Id',
			field: 'id',
			hide: true
		},
		{
			headerName: 'First name',
			field: 'firstName'
		},
		{
			headerName: 'Last name',
			field: 'lastName'
		},
		{
			headerName: 'Email',
			field: 'email'
		},
		{
			headerName: 'Status',
			cellRenderer: 'gridActions',
			maxWidth: 200
		}
	];

	columnApproveDefs: ColDef[] = [
		{
			headerName: 'First name',
			field: 'firstName'
		},
		{
			headerName: 'Last name',
			field: 'lastName'
		},
		{
			headerName: 'Email',
			field: 'email'
		}
	];

	columnDenyDefs: ColDef[] = [
		{
			headerName: 'First name',
			field: 'firstName'
		},
		{
			headerName: 'Last name',
			field: 'lastName'
		},
		{
			headerName: 'Email',
			field: 'email'
		}
	];

	frameworkComponents = {
		gridActions: DataGridActionsComponent,
		gridName: DataGridNameComponent
	};

	actionList = [
		{
			icon: 'done',
			tip: 'Add',
			action: 'approve'
		},
		{
			icon: 'block',
			tip: 'Deny',
			action: 'denied'
		}
	];

	getActions(): any[] {
		return this.gridScope.actionList;
	}

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private categoriesService: CategoriesService,
		private groupService: GroupConfigService,
		private onlineFormService: OnlineFormService,
		private uiMessagingService: UiMessagingService,
		private dialog: MatDialog
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope,
			getActions: this.getActions
		};
	}

	ngOnInit(): void {
		this.initializeForm();
	}

	ngOnDestroy(): void {
		this.alive = false;
	}

	initializeForm(): void {
		if (!history.state.data) {
			this.goBack();
		}
		this.groupData = history.state.data.item.data;
		this.groupId = this.groupData.SK;

		this.categoriesService
			.getList(Constants.CLASS_TYPE_GROUP)
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
		if (this.groupId) {
			this.refreshGrid();
			this.groupService
				.get(this.groupId)
				.pipe(takeWhile(() => this.alive))
				.subscribe((result: any) => {
					this.isLoading = false;
					this.populateForm(result);
				});
		} else {
			this.name = this.groupData.Name;
			this.id = this.groupData.Id;
			this.groupType = this.groupType;
			this.isLoading = false;
		}
	}

	onClassChange($event: any): void {
		const dialogRef = this.dialog.open(DialogConfirmComponent, {
			width: '500px',
			autoFocus: false,
			panelClass: 'mw-appt-section',
			data: { type: this.type }
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.groupType = '';
				this.categoryId = '';
				this.doSave();
				let url;
				if (this.type == 'C') {
					url = '/modules/admin/classes';
					this.router.navigate([url]);
				}
			} else {
				this.type = 'G';
			}
		});
	}
	onChangePublish($event: any) {
		this.isPublished = $event.checked;
	}
	onChangeOpen($event: any) {
		this.isOpen = $event.checked;
	}
	onChangeOpenEnded($event: any) {
		this.groupType = $event.value;
	}
	private populateForm(data: any): void {
		this.id = data.SK;
		this.categoryId = data.Details.CategoryId;
		this.isPublished = data.Details.IsPublished;
		this.isOpen = data.Details.IsOpen;
		this.savedForms = data.FormsList;
		this.name = data.Details.Name;
		this.type = data.Details.Type;
		this.groupType = data.Details.GroupType;
	}

	doSave(): void {
		const payload = {
			id: this.id + '',
			name: this.name,
			categoryId: this.categoryId + '',
			isPublished: this.isPublished,
			formsList: this.savedForms,
			gtype: this.groupType,
			type: this.type ? this.type : Constants.CLASS_TYPE_GROUP,
			isOpen: this.isOpen
		};
		Logger.log(payload);
		if (payload) {
			this.isLoading = true;
			this.groupService
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

	receiveAction(actionObj: { action: string; data: [] }) {
		const action = actionObj.action;
		switch (action) {
			case 'approve':
				this.gridScope.onApprove();
				break;

			case 'denied':
				this.gridScope.onDenied();
				break;
		}
	}

	onApprove() {
		const payload = {
			groupId: this.groupId + '',
			statusType: 'A'
		};
		this.isLoading = true;
		this.groupService
			.process(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.isLoading = false;
				if (data) {
					this.uiMessagingService.showSuccess(
						'Approved Successfully'
					);
					this.refreshGrid();
				}
			});
	}

	onDenied() {
		const payload = {
			groupId: this.groupId + '',
			statusType: 'D'
		};
		this.isLoading = true;
		this.groupService
			.deny(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.isLoading = false;
				if (data) {
					this.uiMessagingService.showMessage('Request Denied');
					this.refreshGrid();
				}
			});
	}

	goBack() {
		this.router.navigate(['modules/admin/groups']);
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
	refreshGrid() {
		this.pendingList$ = this.groupService.pendingList(this.groupId);
		this.approvedList$ = this.groupService.approvedList(this.groupId);
		this.deniedList$ = this.groupService.deniedList(this.groupId);
	}
}
