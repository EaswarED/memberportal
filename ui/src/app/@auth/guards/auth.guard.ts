import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivateChild,
	Router,
	RouterStateSnapshot,
	UrlTree
} from '@angular/router';

import { Observable } from 'rxjs';
import { Logger } from 'src/app/@shared/utils/logger';
import { AppStore } from '../../@shared/datastores/app-store';

@Injectable()
export class AuthGuard implements CanActivateChild {
	constructor(private appStore: AppStore, private router: Router) { }

	canActivateChild(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| boolean
		| UrlTree
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree> {
		const token = this.appStore.getCognitoSession();

		Logger.log(token);
		if (!token || !token.isValid()) {
			this.router.navigate(['auth/login'], {
				queryParams: {
					returnUrl: state.url
				}
			});
			return false;
		}
		return true;
	}
}
