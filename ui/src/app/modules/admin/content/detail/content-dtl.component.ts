import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { Logger } from 'src/app/@shared/utils/logger';
import { Constants } from 'src/app/@shared/utils/constants';
import { UIUtil } from 'src/app/@shared/utils/ui-util';
import { VimeoItemService } from 'src/app/@core/backend/services/selfcare/vimeo/vimeo.service';
import { ContentService } from 'src/app/@core/backend/services/admin/content.service';

@Component({
	selector: 'mw-admin-content-dtl',
	templateUrl: './content-dtl.component.html',
	styleUrls: ['./content-dtl.component.scss']
})
export class ContentDtlComponent implements OnInit {
	private alive: any = true;

	apptData: any;
	id = '';
	name: any;
	description: any;
	categoryId: any;
	categoryList: any;
	type: any;

	tabIndex: number = 0;
	isPublished: boolean = false;
	isLoading: boolean = false;
	pageTitle: any;

	objective: any;
	files: any = [];
	typeList = UIUtil.getContentTypeList();
	file_data: any;

	/**
	 * on file drop handler
	 */
	onFileDropped($event: any) {
		this.prepareFilesList($event);
	}

	/**
	 * handle file from browsing
	 */
	fileBrowseHandler(files: any) {
		this.prepareFilesList(files.target.files);
	}

	/**
	 * Delete file from files list
	 * @param index (File index)
	 */
	deleteFile(index: number) {
		this.files.splice(index, 1);
	}

	/**
	 * Simulate the upload process
	 */
	uploadFilesSimulator(index: number) {
		setTimeout(() => {
			if (index === this.files.length) {
				return;
			} else {
				const progressInterval = setInterval(() => {
					if (this.files[index].progress === 100) {
						clearInterval(progressInterval);
						this.uploadFilesSimulator(index + 1);
					} else {
						this.files[index].progress += 5;
					}
				}, 200);
			}
		}, 1000);
		if (this.files[0]) {
			const reader = new FileReader();
			reader.readAsDataURL(this.files[0]);
			reader.onload = (event: any) => {
				this.file_data = event.target.result;
			};
		}

		if (this.file_data && this.files[0].progress == 100 && this.id) {
			let mimeType = this.files[0].name.split('.').pop();
			const payload = {
				id: this.id,
				data: this.file_data.split(',')[1],
				type: mimeType.trim()
			};
			this.contentService
				.uploadContent(payload)
				.pipe(takeWhile(() => this.alive))
				.subscribe((result: any) => {
					Logger.debug(result);
				});
		}
	}

	/**
	 * Convert Files list to normal array list
	 * @param files (Files List)
	 */
	prepareFilesList(files: Array<any>) {
		for (const item of files) {
			item.progress = 0;
			this.files.push(item);
		}
		this.uploadFilesSimulator(0);
	}

	/**
	 * format bytes
	 * @param bytes (File size in bytes)
	 * @param decimals (Decimals point)
	 */
	formatBytes(bytes: number) {
		if (bytes === 0) {
			return '0 Bytes';
		}
		const decimals = 0;
		const k = 1024;
		const dm = decimals <= 0 ? 0 : decimals || 2;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return (
			parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
		);
	}

	constructor(
		private router: Router,
		private categoriesService: CategoriesService,
		private contentService: ContentService,
		private uiMessagingService: UiMessagingService
	) {}

	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm(): void {
		this.categoriesService
			.getList(Constants.CLASS_TYPE_CONTENT)
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.categoryList = data;
			});

		if (history.state.data) {
			this.isLoading = true;
			this.apptData = history.state.data.item;
			const scId = this.apptData.SK;

			if (scId) {
				this.contentService
					.get(scId)
					.pipe(takeWhile(() => this.alive))
					.subscribe((result: any) => {
						this.isLoading = false;
						this.populateForm(result);
						if (this.type && this.type == 'V') {
							this.typeList = this.typeList.filter(
								(type) => type.show == 'N'
							);
						} else {
							this.typeList = this.typeList.filter(
								(type) => type.show == 'Y'
							);
						}
					});
			} else {
				this.name = this.apptData.Name;
				this.id = this.apptData.id;
				this.description = this.apptData.Description;
				this.type = this.apptData.ContentType;
				this.isLoading = false;
			}
		} else {
			this.typeList = this.typeList.filter((type) => type.show == 'Y');
		}
	}

	private populateForm(data: any): void {
		this.id = data.SK;
		this.categoryId = data.Details.CategoryId;
		this.name = data.Details.Name;
		this.type = data.Details.Type;
		this.isPublished = data.Details.IsPublished;
		this.description = data.Details.Description;
		this.pageTitle = this.name;
	}

	onChangePublish($event: any) {
		this.isPublished = $event.checked;
	}

	doSave() {
		const payload = {
			id: this.id,
			name: this.name,
			categoryId: this.categoryId + '',
			type: this.type,
			isPublished: this.isPublished,
			description: this.description
		};
		Logger.log(payload);

		if (payload) {
			this.isLoading = true;
			this.contentService
				.save(payload)
				.pipe(takeWhile(() => this.alive))
				.subscribe((data: any) => {
					this.isLoading = false;
					this.uiMessagingService.showSuccess('Saved successfully');
					if (data) {
						this.id = data.SK;
						this.uploadFilesSimulator(this.files.length);
					}
				});
		}
	}
	goBack() {
		this.router.navigate(['modules/admin/contents']);
	}
}
