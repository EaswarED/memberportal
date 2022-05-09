import { Injectable } from '@angular/core';
import { Client } from '../../@core/interfaces/site/client';
import { Util } from '../utils/util';

@Injectable({
	providedIn: 'root'
})
export class LocalStore {
	private readonly CLIENT: string = 'MW-CLIENT';
	private readonly SESSION: string = 'MW-SESSION';

	constructor() {}

	private getItem(key: string): any {
		return Util.toJson(localStorage.getItem(key));
	}

	private setItem(key: string, data: any): boolean {
		localStorage.setItem(key, JSON.stringify(data));
		return true;
	}

	getClient(): any {
		return this.getItem(this.CLIENT);
	}

	setClient(obj: Client) {
		return this.setItem(this.CLIENT, obj);
	}

	getSession(): any {
		return this.getItem(this.SESSION);
	}

	setSession(obj: any) {
		return this.setItem(this.SESSION, obj);
	}

	clearSession(): void {
		localStorage.removeItem(this.CLIENT);
		localStorage.removeItem(this.SESSION);
	}
}
