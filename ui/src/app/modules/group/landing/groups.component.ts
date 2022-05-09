import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataGridNameComponent } from '../../../@shared/components/data-grid/name/data-grid-name.component';
import { LandingGroupService } from 'src/app/@core/backend/services/group/landing.service';
import { ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { DataGridDateComponent } from '../../../@shared/components/data-grid/date/data-grid-date.component';
import { GroupService } from '../../../@core/backend/services/group/group-service.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { GridActionsComponent } from '../../actions/grid-actions/grid-actions.component';
import { Constants } from 'src/app/@shared/utils/constants';
import { UIUtil } from 'src/app/@shared/utils/ui-util';
import { Observable } from 'rxjs';
import { OtherService } from 'src/app/@core/backend/services/class/other-service.service';
import { LandingClassService } from 'src/app/@core/backend/services/class/landing.service';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { GroupConfigService } from 'src/app/@core/backend/services/admin/groups.service';
import { CalendarDataComponent } from 'src/app/@shared/components/calendar-data/calendar-data.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
	selector: 'mw-groups',
	templateUrl: './groups.component.html',
	styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {
	alive: boolean = true;
	isReadMore = false;

	CONST = Constants;

	gridList: any[];
	filteredGridList: any[];
	categoryData$: Observable<any>;

	dateFilterList = UIUtil.getDateFilterList();
	selectedFilter: number = 0;

	sessionTypeList: any[];
	selectedCategory: any;
	cardList: any;
	showCard: boolean = false;

	columnDefs: ColDef[] = [
		{
			headerName: 'Group Name',
			field: 'Name',
			cellRenderer: 'gridName',
			minWidth: 220
		},
		{
			headerName: 'Provider Name',
			field: 'StaffName',
			minWidth: 200
		},
		{
			headerName: 'Date',
			field: 'StartDateTime',
			cellRenderer: 'gridDate',
			maxWidth: 200,
			minWidth: 170
		},
		{
			headerName: 'Id',
			field: 'Id',
			hide: true
		},
		{
			headerName: 'Status',
			cellRenderer: 'gridActions',
			minWidth: 300
		}
	];

	gridContext: any;
	gridScope = this;

	frameworkComponents = {
		gridActions: GridActionsComponent,
		gridName: DataGridNameComponent,
		gridDate: DataGridDateComponent
	};
	description =
		'Your scheduled and recommended groups are listed below.  You can book, check-in, join, reschedule or cancel<br>from the menu to the right of the group.  Please note that some groups require approval before joining.  You<br>may request to join the group and will get a call from one of our care coordinators to approve you.<br><br>You will be able to check-in 48 hours prior to your group session and fill out any forms that may be required.<br><br>You will be able to join your session 5 minutes prior to the scheduled start time.<br><br>Our cancellation and rescheduling policy is 24 hours advance notice. &nbsp';
	groupCalendarList: any[] = [];

	constructor(
		private router: Router,
		private landingService: LandingGroupService,
		private landingClassService: LandingClassService,
		private groupConfigService: GroupConfigService,
		private dialog: MatDialog
	) {
		this.gridContext = {
			receiveAction: this.receiveAction,
			gridScope: this.gridScope,
			gridType: Constants.CLASS_TYPE_GROUP
		};
	}

	ngOnDestroy(): void {
		this.alive = false;
	}

	ngOnInit(): void {
		this.loadData();
	}

	onHandleClick(event: any) {
		const data = {
			state: {
				data: {
					categoryId: event.CategoryId,
					sessionId: event.DescriptionId
				}
			}
		};
		if (event.IsApproved == true) {
			this.router.navigate(['/modules/group/create'], data);
		} else {
			this.router.navigate(['/modules/group/join'], data);
		}
	}

	loadData() {
		this.landingService
			.getLandinglist()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.gridList = data;
				data.forEach((element: any) => {
					this.groupCalendarList.push({
						title: element.Name,
						start: element.StartDateTime
					});
				});
				this.refreshList();
			});
		this.categoryData$ = this.landingClassService.type(
			Constants.CLASS_TYPE_GROUP
		);
		this.landingService
			.getList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data: any) => {
				this.sessionTypeList = data;
			});
	}

	receiveAction(actionObj: { action: string; data: any }) {
		const action = actionObj.action;
		const data = actionObj.data;
		this.gridScope.onHandleClick(data);
		Logger.debug('TODO: Placeholder action.. use when needed');
	}

	handleMoreLess() {
		this.isReadMore = !this.isReadMore;
	}

	bookGroups() {
		this.router.navigate(['/modules/group/join']);
	}

	refreshList(): void {
		if (this.selectedFilter === 0) {
			this.filteredGridList = this.gridList;
			return;
		}
		let currDate = new Date();
		currDate.setDate(currDate.getDate() + this.selectedFilter);
		this.filteredGridList = this.gridList.filter(
			(item: any) => new Date(item.StartDateTime) <= currDate
		);
	}

	openCard(item: any) {
		this.selectedCategory = item;
		this.showCard = true;

		this.cardList = this.sessionTypeList.filter(
			(type: any) => type.CategoryId == item.SK
		);
	}

	handleClose() {
		this.showCard = false;
	}

	openCalendar(): void {
		this.dialog.open(CalendarDataComponent, {
			data: this.groupCalendarList,
			width: '100%'
		});
	}
	callToAction(event: any) {
		const data = {
			state: {
				data: {
					categoryId: event.CategoryId,
					sessionId: event.Id
				}
			}
		};
		this.router.navigate(['/modules/group/join'], data);
	}
}
