import { Component, OnInit, OnDestroy } from '@angular/core';
import {
	Router,
	ActivatedRoute,
	NavigationEnd,
	Event as NavigationEvent
} from '@angular/router';
import { AppStore } from '../../datastores/app-store';

@Component({
	selector: 'mw-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
	dockBasicItems: any = [];
	currentRoute: string;

	event$;

	constructor(private router: Router, private appStore: AppStore) {
		this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
			if (event instanceof NavigationEnd) {
				this.currentRoute = event.url;
			}
		});
	}

	ngOnInit(): void {
		this.dockBasicItems = [
			{
				label: 'Dashboard',
				icon: 'home',
				routerLink: '/modules/dashboard'
			},
			{
				label: 'Appointment',
				icon: 'event',
				routerLink: '/modules/appt'
			},
			{
				label: 'Groups',
				icon: 'groups',
				routerLink: '/modules/group'
			},
			{
				label: 'Classes',
				icon: 'accessibility',
				routerLink: '/modules/class'
			},
			{
				label: 'Selfcare',
				icon: 'local_hospital',
				routerLink: '/modules/selfcare'
			}
		];

		if (this.appStore.isClientAdmin()) {
			this.dockBasicItems.push({
				label: 'Configuration',
				icon: 'settings',
				routerLink: '/modules/admin'
			});
		}
	}

	ngOnDestroy() {
		this.event$.unsubscribe();
	}
}
