import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'mw-default-layout',
	styleUrls: ['./default.layout.scss'],
	template: `<mw-header (menuState)="burgerClicked($event)"></mw-header>

		<mw-menu></mw-menu>

		<mw-sidebar [subMenuState]="subMenuState"></mw-sidebar>

		<div class="mw-content">
			<div toastContainer></div>
			<router-outlet></router-outlet>
		</div>

		<mw-footer></mw-footer> `
})
export class DefaultLayoutComponent {
	@ViewChild(ToastContainerDirective, { static: true })
	toastContainer: ToastContainerDirective;
	subMenuState: boolean = false;

	constructor(private toastrService: ToastrService) {}

	ngOnInit() {
		this.toastrService.overlayContainer = this.toastContainer;
	}

	burgerClicked(evnt: any) {
		this.subMenuState = evnt;
	}
}
