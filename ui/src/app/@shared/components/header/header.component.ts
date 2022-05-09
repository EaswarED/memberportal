import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { NotificationService } from 'src/app/@core/backend/services/users/notification.service';
import { AppStore } from '../../datastores/app-store';
import { Logger } from '../../utils/logger';

@Component({
	selector: 'mw-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	@Output() menuState = new EventEmitter();

	showMenu = false;
	private alive: boolean = true;

	notificationList: any;
	dataList: any = [];
	clientId: number;
	clientName: string;
	clientPicture: any;

	client = [
		{ id: 100000034, client: 'Dev Client 1' },
		{ id: 100000025, client: 'Dev Client 2' },
		{ id: 100000032, client: 'Dev Admin' }
	];

	constructor(
		private router: Router,
		private appStore: AppStore,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.renderData();
	}
	displayedColumns: string[] = ['fullname', 'subject'];

	private renderData(): void {
		if (!this.appStore.getClient()) {
			this.appStore.setCurrentClient(this.client[0]);
		}
		this.clientId = this.appStore.getClientId();
		this.clientName = this.appStore.getClientName();
		this.clientPicture = this.appStore.getClientIamge();
		this.notificationService
			.GetNotificationDetails()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				console.log(data);
				if (data) {
					this.dataList = data;
				}
			});
	}

	refreshClient($event: any): void {
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
		const url = 'auth';
		this.router.navigate([url], {
			state: {
				data: $event.value
			}
		});
	}

	private reload(): void {
		const currentUrl = this.router.url;
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
		this.router.navigate([currentUrl]);
	}

	onProfileClicked() {
		this.router.navigate(['/modules/users']);
	}

	onBillingClicked() {
		this.router.navigate(['/modules/users/billing']);
	}

	handleLogout(): void {
		this.router.navigate(['/auth/logout']);
	}

	onBtnClicked(event: any) {
		const stateData = {
			state: {
				data: {
					selectedIndex: 1
				}
			}
		};
		this.router.navigate(['/modules/users'], stateData);
	}

	getInitials(nameString: any) {
		const fullName = nameString.split(' ');
		const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
		return initials.toUpperCase();
	}

	toggleMenu() {
		this.showMenu = !this.showMenu;
		this.menuState.emit(this.showMenu);
	}
}
