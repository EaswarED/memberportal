import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivateChild,
	Router,
	RouterStateSnapshot,
	UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';
import { Constants } from 'src/app/@shared/utils/constants';
import { AppStore } from '../../@shared/datastores/app-store';

@Injectable()
export class AdminGuard implements CanActivateChild {
	constructor(
		private appStore: AppStore,
		private uiMessagingService: UiMessagingService,
		private router: Router
	) {}

	canActivateChild(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| boolean
		| UrlTree
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree> {
		const token = this.appStore.getCognitoSession();
		const client = this.appStore.getClient();

		if (!token || !token.isValid()) {
			this.router.navigate(['auth/login'], {
				queryParams: {
					returnUrl: state.url
				}
			});
			return false;
		} else if (client.groups?.indexOf(Constants.ADMIN_GROUP_NAME) == -1) {
			this.uiMessagingService.showError('Admin access is not enabled');
			this.router.navigate(['modules/dashboard'], {
				queryParams: {
					returnUrl: state.url
				}
			});
			return false;
		}
		return true;
	}
}
