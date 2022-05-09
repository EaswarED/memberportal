import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/@shared/utils/constants';
import { CreateClassBookService } from 'src/app/@core/backend/services/class/create-class-book.service';
import { LandingGroupService } from 'src/app/@core/backend/services/group/landing.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';

@Component({
	selector: 'mw-req-join',
	templateUrl: './req-join.component.html',
	styleUrls: ['./req-join.component.scss']
})
export class ReqJoinComponent implements OnInit {
	private alive = true;
	isLoading: boolean = true;

	formGroup: FormGroup;

	bookingId: any;

	groupDescId: any;
	categoryList: any;
	groupList: any;

	selectedGroupList: any[];
	selectedGroup: any;
	categoryId: any;
	isBookNow = false;
	isRequestJoin = false;
	isDisable = false;

	constructor(
		private formBuilder: FormBuilder,
		private categoriesService: CategoriesService,
		private createClassBookService: CreateClassBookService,
		private landingGroupService: LandingGroupService,
		private router: Router,
		private uiMessagingService: UiMessagingService
	) {}

	get formArray(): AbstractControl | null {
		return this.formGroup.get('formArray');
	}

	get categoryCtrl() {
		return this.formGroup.get('categoryCtrl');
	}

	get groupCtrl() {
		return this.formGroup.get('groupCtrl');
	}

	/** Returns a FormArray with the name 'formArray'. */
	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm() {
		this.checkIfRechedule();
		this.isLoading = true;
		this.categoriesService
			.getList(Constants.CLASS_TYPE_GROUP)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.categoryList = data;
			});
		this.createClassBookService
			.GroupBook()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.groupList = data;
				if (this.bookingId) this.onCategoryChange();
				if (this.categoryId) this.onCategoryChange();
				this.isLoading = false;
			});

		this.formGroup = this.formBuilder.group({
			categoryCtrl: [this.categoryId, Validators.required],
			groupCtrl: [this.groupDescId, Validators.required]
		});
	}

	private checkIfRechedule(): void {
		if (!history.state.data) {
			return;
		}
		this.isLoading = true;
		this.bookingId = history.state.data.bookingId;
		this.categoryId = history.state.data.categoryId;
		this.groupDescId = history.state.data.sessionId;
	}

	onCategoryChange(): void {
		this.isLoading = true;
		this.selectedGroupList = this.groupList.filter(
			(item: any) => item.CategoryId === this.categoryId
		);

		if (this.selectedGroupList.length > 0) {
			this.isLoading = false;
		} else {
			this.isLoading = false;
			this.uiMessagingService.showMessage('No Schedule Time Available');
		}

		if (this.bookingId) {
			this.groupCtrl?.setValue(this.groupDescId);
		} else if (this.groupDescId) {
			this.groupCtrl?.setValue(this.groupDescId);
			this.onGroupChange();
		} else {
			this.groupDescId = undefined;
		}
	}

	onGroupChange() {
		this.selectedGroup = this.groupList.filter(
			(item: any) => item.DescId === this.groupDescId
		);

		if (
			this.selectedGroup[0].Approved.length > 0 &&
			this.selectedGroup[0].IsApproved == true
		) {
			this.isRequestJoin = false;
			this.isBookNow = true;
			this.isDisable = false;
		} else if (this.selectedGroup[0].Pending.length > 0) {
			this.isBookNow = true;
			this.isDisable = true;
			this.isRequestJoin = false;
		} else if (
			this.selectedGroup[0].Pending.length == 0 &&
			this.selectedGroup[0].IsApproved == false
		) {
			this.isBookNow = false;
			this.isDisable = false;
			this.isRequestJoin = true;
		}
	}

	onNextGroupBTN() {
		this.isLoading = true;
		this.landingGroupService
			.requestjoin(this.groupDescId)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.isLoading = false;
				if (data) {
					this.uiMessagingService.showSuccess(
						'Request Sent SuccessFully'
					);
					this.router.navigate(['/modules/group']);
				}
			});
		this.isLoading = false;
	}

	onBookGroupBTN() {
		const data = {
			state: {
				data: {
					categoryId: this.categoryId,
					sessionId: this.groupDescId
				}
			}
		};
		this.router.navigate(['/modules/group/create'], data);
	}

	cancel(): void {
		this.router.navigate(['/modules/group']);
	}
}
