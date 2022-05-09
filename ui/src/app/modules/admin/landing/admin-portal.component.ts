import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from 'src/app/@shared/utils/logger';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogPaymentComponent } from 'src/app/@shared/components/dialog-payment/dialog-payment.component';

@Component({
	selector: 'mw-admin-portal',
	templateUrl: './admin-portal.component.html',
	styleUrls: ['./admin-portal.component.scss']
})
export class AdminPortalComponent implements OnInit {
	breakpoint: boolean = false;
	configuration = [
		{
			name: 'Appointment',
			icon: 'event',
			route: '/modules/admin/appointments'
		},
		{
			name: 'Classes',
			icon: 'accessibility',
			route: '/modules/admin/classes'
		},
		{
			name: 'Groups',
			icon: 'supervisor_account',
			route: '/modules/admin/groups'
		},
		{
			name: 'Self Care',
			icon: 'local_hospital',
			route: '/modules/admin/contents'
		},
		{
			name: 'Categories',
			icon: 'description',
			route: '/modules/admin/categories'
		},
		{
			name: 'Forms',
			icon: 'settings_system_daydream',
			route: '/modules/admin/forms'
		},
		{
			name: 'Company',
			icon: 'location_city',
			route: '/modules/admin/companies'
		},
		{
			name: 'Providers',
			icon: 'text_fields',
			route: '/modules/admin/providers'
		},
		{
			name: 'Recommendations',
			route: '/modules/admin/promotions',
			icon: 'speaker_phone'
		},
		{
			name: 'Permissions',
			route: '/modules/admin/access',
			icon: 'cloud_queue'
		},
		{
			name: 'Users',
			route: '/modules/admin/users',
			icon: 'person'
		}
	];
	constructor(private router: Router, private dialog: MatDialog) {}
	ngOnInit(): void {
		Logger.debug(window.innerWidth);
		setTimeout(() => {
			this.breakpoint = window.innerWidth <= 959 ? false : true;
		}, 1000);
	}
	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.breakpoint = window.innerWidth <= 959 ? false : true;
	}
	onConfigURL(event: any) {
		const route = event.route;
		if (route) {
			this.router.navigate([route]);
		} else {
			Logger.debug('No router');
		}
	}
}
