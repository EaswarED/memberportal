import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { takeWhile } from 'rxjs/operators';
import { UIUtil } from 'src/app/@shared/utils/ui-util';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { Logger } from 'src/app/@shared/utils/logger';

@Component({
	selector: 'mw-admin-category-dtl',
	templateUrl: './category-dtl.component.html',
	styleUrls: ['./category-dtl.component.scss']
})
export class CategoryDtlComponent implements OnInit, OnDestroy {
	private alive: any = true;

	id: any;
	sk: any;
	name: string;
	description: string;
	type: string;
	pageTitle: string;
	imageUrl: String;

	typeList = UIUtil.getTypeDropdownList();

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private categoriesService: CategoriesService,
		private uiMessagingService: UiMessagingService
	) {}

	ngOnInit(): void {
		this.initializeForm();
	}

	ngOnDestroy(): void {
		this.alive = false;
	}

	initializeForm() {
		this.id = this.activatedRoute.snapshot.paramMap.get('id');
		if (this.id) {
			this.categoriesService
				.get(this.id)
				.pipe(takeWhile(() => this.alive))
				.subscribe((result: any) => {
					this.populateForm(result);
				});
		} else {
			this.pageTitle = 'New Category';
		}
	}

	goBack() {
		this.router.navigate(['modules/admin/categories']);
	}

	save(): void {
		const payload = {
			id: this.id,
			name: this.name,
			description: this.description,
			type: this.type,
			imageUrl: this.imageUrl
		};
		Logger.debug(payload);
		this.categoriesService
			.save(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.populateForm(data);
				this.uiMessagingService.showSuccess(
					'Record saved successfully'
				);
			});
	}

	archive(): void {
		const payload = {
			id: this.id,
			name: this.name,
			description: this.description,
			type: this.type,
			imageUrl: this.imageUrl
		};
		Logger.debug(payload);
		this.categoriesService
			.archive(payload)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.populateForm(data);
				this.uiMessagingService.showSuccess(
					'Record Deleted successfully'
				);
			});
	}

	private populateForm(data: any): void {
		this.sk = data.sk;
		this.name = data.Details.Name;
		this.description = data.Details.Description;
		this.type = data.Details.Type;
		this.pageTitle = this.name;
		this.imageUrl = data.Details.ImageUrl;
	}
}
