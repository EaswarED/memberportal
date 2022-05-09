import { Constants } from './constants';
import { Logger } from './logger';

export class Util {
	public static isNull(val: string): boolean {
		if (!val || val === null || val === '') {
			return true;
		} else {
			return false;
		}
	}

	public static toBoolean(val: string): boolean {
		if (val === 'Y') {
			return true;
		} else {
			return false;
		}
	}

	public static toString(val: boolean): string {
		if (val) {
			return 'Y';
		} else {
			return 'N';
		}
	}

	public static toLower(val: string): string {
		if (val) {
			return val.toLowerCase();
		}
		return '';
	}

	public static toInt(val: string): number {
		if (val) {
			return parseInt(val);
		} else {
			return 0;
		}
	}

	public static toJson(val: any): any {
		let jsonVal: any;
		if (val) {
			try {
				jsonVal = JSON.parse(val);
			} catch (e) {}
		}
		return jsonVal;
	}

	public static setOptionVal(optionVal: string, val: number): string {
		if (optionVal.length > 0) {
			optionVal = optionVal + ',';
		}
		optionVal = optionVal + val;
		return optionVal;
	}

	public static getMsRemaining(futureDate: string): number {
		return new Date(futureDate).getTime() - Date.now();
	}

	public static getCountdown(futureDate: string): string | null {
		const msRemaining = Util.getMsRemaining(futureDate);

		if (msRemaining < 0) {
			// Past Time
			return null;
		} else if (msRemaining > Constants.COUNTDOWN_CHECKIN_MS) {
			// Over 1 day
			return null;
		}

		let seconds: string | number = Math.floor((msRemaining / 1000) % 60),
			minutes: string | number = Math.floor(
				(msRemaining / (1000 * 60)) % 60
			),
			hours: string | number = Math.floor(
				(msRemaining / (1000 * 60 * 60)) % 24
			);

		seconds = seconds < 10 ? '0' + seconds : seconds;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		hours = hours < 10 ? '0' + hours : hours;

		return `${hours}:${minutes}:${seconds}`;
	}
}
