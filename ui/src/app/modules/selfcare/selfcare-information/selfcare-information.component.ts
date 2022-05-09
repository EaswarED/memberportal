import {
	Component,
	ContentChild,
	ElementRef,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { SiteContentSerice } from 'src/app/@core/backend/services/dashboard/site-content.service';
import { VimeoItemService } from 'src/app/@core/backend/services/selfcare/vimeo/vimeo.service';
import { StaffService } from 'src/app/@core/backend/services/staff/staff.service';
import { SafePipe } from 'src/app/@shared/pipes';
import { Logger } from 'src/app/@shared/utils/logger';

@Component({
	selector: 'mw-selfcare-information',
	templateUrl: './selfcare-information.component.html',
	styleUrls: ['./selfcare-information.component.scss']
})
export class SelfCareInformationComponent implements OnInit, OnDestroy {
	private alive: boolean = true;
	isLoading: boolean = true;
	staffList: any = [];

	isActiveQuestion: boolean = false;
	isQuestion: boolean = true;
	historyData: any;
	video_list: any = [];
	related_video_list: any = [];

	name: string;
	description: any;
	id: any;
	uri: SafeResourceUrl;
	type: any;

	constructor(
		private router: Router,
		private vimeoItemService: VimeoItemService,
		public sanitizer: DomSanitizer,
		private staffService: StaffService,
		private contentService: SiteContentSerice
	) {}
	ngOnInit(): void {
		this.loadData();
	}

	loadData() {
		this.historyData = history.state.data;
		if (!this.historyData) {
			this.goBack();
		} else {
			this.vimeoItemService
				.get(this.historyData.scid)
				.pipe(takeWhile(() => this.alive))
				.subscribe((data) => {
					this.populateForm(data[0]);
					this.isLoading = false;
				});
		}
		this.contentService
			.getSelfcareVimeoList()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				Logger.debug('Related Video' + data);
				this.related_video_list = data;
				this.isLoading = false;
			});
	}
	goBack() {
		this.router.navigate(['modules/selfcare']);
	}
	onAskQuestion(event: any) {
		if (event == 1) {
			this.isQuestion = false;
			this.isActiveQuestion = true;
		} else {
			this.isQuestion = true;
			this.isActiveQuestion = false;
		}
	}

	ngOnDestroy(): void {
		this.alive = false;
	}

	private populateForm(data: any): void {
		this.name = data.contentName;
		this.id = data.id;
		this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(
			'https://player.vimeo.com/video/' + this.id
		);
		this.description = data.description;
		this.type = data.typec;
	}
	getSanitizedURL(id: any) {
		return;
	}
	onRelatedClick(event: any) {
		const stateData = {
			state: {
				data: event
			}
		};
		this.router
			.navigateByUrl('/', { skipLocationChange: true })
			.then(() => {
				this.router.navigate(
					['modules/selfcare/information'],
					stateData
				);
			});
	}
}
