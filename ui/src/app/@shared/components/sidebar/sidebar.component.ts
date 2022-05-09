import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	OnChanges,
	Output,
	EventEmitter
} from '@angular/core';
import {
	Router,
	ActivatedRoute,
	NavigationEnd,
	Event as NavigationEvent
} from '@angular/router';

@Component({
	selector: 'mw-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnChanges {
	dockBasicItems: any = [];
	currentRoute: string;

	@Input() subMenuState: boolean;
	@Output() sidebarMenu = new EventEmitter();
	constructor(private router: Router) {}
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
			// {
			// 	label: 'Help',
			// 	icon: 'help',
			// 	routerLink: '/modules/help'
			// },
			// {
			// 	label: 'Configuration',
			// 	icon: 'settings',
			// 	routerLink: '/modules/admin'
			// }
		];

		this.showMenu = this.subMenuState;
	}

	showMenu = true;
	ngOnChanges() {
		this.showMenu = this.subMenuState;
	}
	sideBarClicked($event: any) {
		const currentUrl = this.router.url;
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
		this.router.navigate([$event]);
	}
}
