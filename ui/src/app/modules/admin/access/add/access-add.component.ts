import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable, of } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { Logger } from 'src/app/@shared/utils/logger';
import { Constants } from 'src/app/@shared/utils/constants';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { ColDef } from 'ag-grid-community';
import { DataGridNameComponent } from 'src/app/@shared/components/data-grid/name/data-grid-name.component';
import { CompaniesService } from 'src/app/@core/backend/services/admin/company.service';
import { Router } from '@angular/router';
import { AccessService } from 'src/app/@core/backend/services/admin/access.service';
import { ClientsService } from 'src/app/@core/backend/services/admin/client.service';

@Component({
	selector: 'mw-access-add',
	templateUrl: './access-add.component.html',
	styleUrls: ['./access-add.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessAddComponent implements OnInit, OnDestroy {
	private alive = true;

	stepperOrientation: Observable<StepperOrientation>;
	CONST = Constants;

	private classId: number;
	private classType: string;
	searchData$: Observable<any>;
	empty$: Observable<any>;
	promotionType: string;
	selectedRows: any[];

	searchByName: any;

	@ViewChild('stepper') stepper: MatStepper;

	companyColumnDefs: ColDef[] = [
		{
			headerName: 'Id',
			field: 'SK',
			hide: true
		},
		{
			headerName: 'Company Name',
			field: 'Name',
			cellRenderer: 'gridName',
			checkboxSelection: true
		},
		{
			headerName: 'Location',
			field: 'StateCd'
		},
		{
			headerName: 'Website',
			field: 'Email'
		}
	];
	userColumnDefs: ColDef[] = [
		{
			headerName: 'Id',
			field: 'SK',
			hide: true
		},
		{
			headerName: 'First Name',
			field: 'firstName',
			cellRenderer: 'gridName',
			checkboxSelection: true
		},
		{
			headerName: 'Last Name',
			field: 'lastName',
			cellRenderer: 'gridName'
		},
		{
			headerName: 'Email',
			field: 'email',
			cellRenderer: 'gridName'
		}
	];
	selectedCompanyColumnDefs: ColDef[] = [
		{
			headerName: 'Id',
			field: 'SK',
			hide: true
		},
		{
			headerName: 'Name',
			field: 'Name',
			headerClass: 'header_align',
			cellStyle: { textAlign: 'center', width: '100%' }
		}
	];

	selectedUserColumnDefs: ColDef[] = [
		{
			headerName: 'Id',
			field: 'SK',
			hide: true
		},
		{
			headerName: 'Name',
			field: 'firstName',
			headerClass: 'header_align',
			cellStyle: { textAlign: 'center', width: '100%' }
		}
	];

	frameworkComponents = {
		gridName: DataGridNameComponent
	};

	constructor(
		private router: Router,
		private uiMessagingService: UiMessagingService,
		private accessService: AccessService,
		private companiesService: CompaniesService,
		private clientsService: ClientsService,
		breakpointObserver: BreakpointObserver
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
	}

	ngOnInit(): void {
		this.initializeForm();
	}

	private initializeForm() {
		const data = history.state.data;
		if (data) {
			this.classId = data.classId;
			this.classType = data.classType;
		}
	}

	rowSelectionChanged($event: any): void {
		const api = $event.api;
		this.selectedRows = api.getSelectedRows();
		if (this.selectedRows.length === 0) {
			if (this.stepper.selected) this.stepper.selected.completed = false;
		} else {
			if (this.stepper.selected) this.stepper.selected.completed = true;
		}
	}

	goToStep2(): void {
		if (!this.promotionType) {
			this.uiMessagingService.showError('Incomplete selection');
			return;
		}
		if (this.promotionType === Constants.ACCESS_PROMOTION_TYPE_COMPANY) {
			this.searchData$ = this.companiesService.getSelectedList();
		}
		if (this.promotionType === Constants.ACCESS_PROMOTION_TYPE_USER) {
			this.searchData$ = this.empty$;
		}
		this.selectedRows = [];
		if (this.stepper.selectedIndex === 1) {
			return;
		}
		if (this.stepper.selected) this.stepper.selected.completed = true;
		this.stepper.next();
	}

	goToStep3(): void {
		if (!this.selectedRows || this.selectedRows.length === 0) {
			this.uiMessagingService.showError('No selected are made');
			return;
		}
		this.stepper.next();
	}

	handleAccessChange($event: any): void {
		this.promotionType = $event.value;
	}

	onSearch() {
		this.searchData$ = this.clientsService.get(this.searchByName);
	}

	saveAccess(): void {
		let payload: any = {
			classId: this.classId,
			classType: this.classType,
			promotionType: this.promotionType
		};
		if (this.promotionType !== Constants.ACCESS_PROMOTION_TYPE_GLOBAL) {
			const selectedValues = this.selectedRows.map((item) => {
				return String(item.Id ? item.Id : item.id);
			});
			payload['selectedValues'] = selectedValues;
		}
		Logger.log(payload);

		this.accessService
			.add(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.uiMessagingService.showSuccess(
					'Access added successfully'
				);
				this.cancel();
			});
	}

	goBack(): void {
		this.stepper.previous();
	}

	cancel(): void {
		this.router.navigate(['modules/admin/access']);
	}

	ngOnDestroy(): void {
		this.alive = false;
	}
}
