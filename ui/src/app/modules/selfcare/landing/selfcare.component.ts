import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { ContentService } from 'src/app/@core/backend/services/admin/content.service';
import { VimeoItemService } from 'src/app/@core/backend/services/selfcare/vimeo/vimeo.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { Constants } from 'src/app/@shared/utils/constants';
import { Logger } from 'src/app/@shared/utils/logger';

@Component({
	selector: 'mw-selfcare',
	templateUrl: './selfcare.component.html',
	styleUrls: ['./selfcare.component.scss']
})
export class SelfCareComponent implements OnInit, OnDestroy {
	// Charan 12/09
	private alive = true;
	categoryList: any[];
	typeList: any[];
	customList: any[] = [
		// { id: 1, name: 'Favorites' },
		// { id: 2, name: 'Global' },
		// { id: 3, name: 'My Company' },
		// { id: 4, name: 'My Content' }
	];
	selectedFilters: any[] = [];
	originalVideoList: any[];
	filteredVideoList: any[];

	isDisplayMore: boolean = true;
	isDisplayLess: boolean = false;
	isLoadingDisplay: boolean;

	constructor(
		private router: Router,
		private vimeoItemService: VimeoItemService,
		private categoriesService: CategoriesService,
		private contentService: ContentService,
		private uiMessagingService: UiMessagingService
	) {}
	ngOnInit(): void {
		this.load_data();
	}

	load_data() {
		this.isLoadingDisplay = true;
		// this.vimeoItemService
		// 	.getCategoryVimeoList()
		// 	.pipe(takeWhile(() => this.alive))
		// 	.subscribe((data) => {
		// 		this.categoryList = data;
		// 	});
		this.categoriesService
			.getList(Constants.CLASS_TYPE_CONTENT)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.categoryList = data;
			});
		this.vimeoItemService
			.getTypeVimeoList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.typeList = data;
			});
		this.vimeoItemService
			.getVideoVimeoList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.originalVideoList = data;
				this.filteredVideoList = data;
				this.isLoadingDisplay = false;
			});

		this.vimeoItemService
			.getContentTypeVimeoList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.customList = data;
			});
	}

	onBtnClicked(event: any) {
		if (event.type != 'V') {
			this.contentService
				.readContent(event.scid)
				.pipe(takeWhile(() => this.alive))
				.subscribe((result) => {
					const fileURL = this.onB642Blob(result);
					window.open(
						fileURL,
						'directories=no,titlebar=no,toolbar=no,location=yes,menubar=no,height=570,width=720,scrollbars=yes,status=yes'
					);
				});
		} else {
			this.router.navigate(['modules/selfcare/information'], {
				state: {
					data: event
				}
			});
		}
	}

	onB642Blob(b64Data: any) {
		const type = b64Data.fileDetails.split('.').pop();
		let mimetype = '';
		if (type == 'pdf') {
			mimetype = 'application/pdf';
		} else {
			mimetype = 'text/html';
		}
		const binaryString = window.atob(b64Data.data);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; ++i) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		const blob = new Blob([bytes], {
			type: mimetype
		});
		return URL.createObjectURL(blob);
	}

	@HostListener('window:scroll', [])
	onScroll(): void {
		if (this.bottomReached()) {
		}
	}

	bottomReached(): boolean {
		return (
			window.innerHeight + window.scrollY >= document.body.offsetHeight
		);
	}
	onShowMoreLess(event: any) {
		Logger.log(
			'Come up with a new logic or enable Scrollbar for just the Categoory'
		);
		// if (event == 'M') {
		// 	this.endNo = this.task1.subtasks1.length;
		// 	this.isDisplayMore = false;
		// 	this.isDisplayLess = true;
		// } else {
		// 	this.endNo = 4;
		// 	this.isDisplayMore = true;
		// 	this.isDisplayLess = false;
		// }
	}

	// Charan 12/09
	handleFilter($event: any, item: any, filterType: string): void {
		const checkedStatus = $event.checked;
		let id: number, name: string, typec: any;
		if (filterType === 'C') {
			// Category Filter
			id = item.SK;
			name = item['Details.Name'];
		} else if (filterType === 'T') {
			// Type Filter
			id = item.id;
			name = item.name;
			typec = item.type;
		} else {
			// My Filter
			id = item.id;
			name = item.name;
		}
		const obj = {
			id: id,
			name: name,
			typec: typec,
			type: filterType
		};
		if (checkedStatus) {
			this.selectedFilters.push(obj);
		} else {
			this.removeChip(obj);
		}
		this.refreshVideo();
	}

	removeFilter(item: any): void {
		this.removeChip(item);

		if (item.type === 'C') {
			// Category Filter
			this.categoryList.find((obj) => obj.SK === item.id)['isChecked'] =
				false;
		} else if (item.type === 'T') {
			// Type Filter
			this.typeList.find((obj) => obj.id === item.id)['isChecked'] =
				false;
		} else if (item.type === 'M') {
			// My Filter
			this.customList.find((obj) => obj.id === item.id)['isChecked'] =
				false;
		}
		this.refreshVideo();
	}

	private removeChip(item: any): void {
		this.selectedFilters = this.selectedFilters.filter(
			(obj) => obj.id + obj.type !== item.id + item.type
		);
	}

	private refreshVideo(): void {
		this.filteredVideoList = [];
		this.selectedFilters.forEach((item) => {
			let list_video = [];
			if (item.type === 'C') {
				list_video = this.originalVideoList.filter(
					(obj) => obj.categoryId === item.id
				);
			} else if (item.type === 'T') {
				list_video = this.originalVideoList.filter(
					(obj) => obj.type === item.typec
				);
			} else {
				list_video = this.originalVideoList.filter(
					(obj) => obj.type === item.id
				);
			}
			list_video.forEach((data) => {
				this.filteredVideoList.push(data);
				this.filteredVideoList = this.filteredVideoList.filter(
					(test, index, array) =>
						index ===
						array.findIndex(
							(findTest) => findTest.scid === test.scid
						)
				);
			});
		});
		if (this.selectedFilters.length === 0) {
			this.filteredVideoList = this.originalVideoList;
		}
	}

	ngOnDestroy() {
		this.alive = false;
	}
}
