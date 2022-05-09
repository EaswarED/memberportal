import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlineFormService } from 'src/app/@core/backend/services/admin/form.service';
import { DialogItem } from 'src/app/@shared/interfaces/dialog-data.interface';
import { Logger } from 'src/app/@shared/utils/logger';

@Component({
	selector: 'mw-non-clinical-fb-configuration',
	templateUrl: './non-clinical-fb-one-configuration.component.html',
	styleUrls: ['./non-clinical-fb-one-configuration.component.scss']
})
export class NonClinicalFBOneConfigurationComponent implements OnInit {
	fb_id: any;
	get_form: any;
	urlSafe: any;
	name: any;
	constructor(
		private router: Router,
		private onlineFormService: OnlineFormService,
		private activatedRoute: ActivatedRoute,
		public sanitizer: DomSanitizer,
		public dialogRef: MatDialogRef<NonClinicalFBOneConfigurationComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogItem
	) {}
	ngOnInit(): void {
		this.load_data();
	}

	load_data(): void {
		this.activatedRoute.params.subscribe((params) => {
			this.fb_id = params['id'];
		});
		if (this.data.type) {
			this.fb_id = this.data.type;
		}
		this.onlineFormService.getNonClinicalForms().subscribe((data) => {
			this.get_form = data.filter((item: any) => item.id == this.fb_id);
			Logger.debug(this.get_form);
			this.get_form.forEach((element: any) => {
				this.name = element.title;
				this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
					element.url
				);
			});
		});
	}

	onAddConfiguration() {
		// this.router.navigate(['admin/create-appt']);
	}
	onBackAction() {
		this.router.navigate(['modules/admin/nonclinical']);
	}
}
