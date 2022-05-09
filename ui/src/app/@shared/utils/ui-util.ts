import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Constants } from './constants';
import { Util } from './util';
import { Logger } from './logger';

@Injectable({
	providedIn: 'root'
})
export class UIUtil {
	public static formatDate(val: string) {
		return new DatePipe('en-US').transform(val, 'MM/dd/yyyy');
	}

	public formatDisplay(conditionValue: any, displayValue: string) {
		return conditionValue ? displayValue : '';
	}

	public static formatStatus(params: any): string {
		if (params.value && params.value === true) {
			return 'Yes';
		}
		return '';
	}

	public static formatValidity(params: any): string {
		const validity = params.value;
		if (validity && validity === -1) {
			return 'Everytime';
		} else if (validity && validity === 0) {
			return 'One Time';
		} else if (validity && validity === 1) {
			return 'One Month';
		} else if (validity && validity === 3) {
			return 'Three Months';
		} else if (validity && validity === 6) {
			return 'Six Months';
		} else if (validity && validity === 12) {
			return 'One Year';
		}
		return '';
	}

	public static getBookingStatusLabel(
		startDateTime: string,
		rowData: any,
		type: any
	): string | null {
		if (!startDateTime) return Constants.LABEL_BUTTON_BOOK_NOW;

		const msRemaining = Util.getMsRemaining(startDateTime);
		if (msRemaining < 0) {
			return null;
		} else if (msRemaining <= Constants.COUNTDOWN_JOIN_MS) {
			if (
				type == Constants.CLASS_TYPE_APPOINTMENT ||
				type == Constants.CLASS_LABEL_APPOINTMENT
			) {
				if (
					rowData.AppointmentStatus ==
					Constants.LABEL_BUTTON_CONFIRMED
				) {
					return Constants.LABEL_BUTTON_JOIN;
				} else {
					return Constants.LABEL_BUTTON_CHECKIN;
				}
			} else {
				if (rowData.SignedIn == true) {
					return Constants.LABEL_BUTTON_JOIN;
				} else {
					return Constants.LABEL_BUTTON_CHECKIN;
				}
			}
		} else if (msRemaining <= Constants.COUNTDOWN_CHECKIN_MS) {
			if (
				type == Constants.CLASS_TYPE_APPOINTMENT ||
				type == Constants.CLASS_LABEL_APPOINTMENT
			) {
				if (
					rowData.AppointmentStatus ==
					Constants.LABEL_BUTTON_CONFIRMED
				) {
					return Constants.LABEL_BUTTON_CHECKEDIN;
				} else {
					return Constants.LABEL_BUTTON_CHECKIN;
				}
			} else {
				if (rowData.SignedIn == true) {
					return Constants.LABEL_BUTTON_CHECKEDIN;
				} else {
					return Constants.LABEL_BUTTON_CHECKIN;
				}
			}
		} else if (msRemaining > 0) {
			// return Constants.LABEL_BUTTON_BOOKED;
			return null;
		} else {
			return '?'; // Deveelopment issue... requires fix
		}
	}

	public static getDateFilterList(): any[] {
		return [
			{ name: 'All Sessions', code: 0 },
			{ name: 'Next 7 days', code: Constants.FILTER_NEXT_7 },
			{ name: 'Next 30 days', code: Constants.FILTER_NEXT_30 },
			{ name: 'Next 60 days', code: Constants.FILTER_NEXT_60 }
		];
	}

	public static getPeriodFilterList(): any[] {
		return [
			{ name: 'Daily View', code: 0 },
			{ name: 'Weekly View', code: 1 }
		];
	}

	public static getTypeDropdownList(): any[] {
		return [
			{ name: 'Appointment', code: 'A' },
			{ name: 'Class', code: 'C' },
			{ name: 'Group', code: 'G' },
			{ name: 'Content', code: 'S' }
		];
	}

	public static getContentTypeList(): any[] {
		return [
			{ name: 'Video', code: 'V', show: 'N' },
			{ name: 'PDF', code: 'P', show: 'Y' }
		];
	}

	public static getTimePeriodList(): any[] {
		return [
			{ name: 'Everytime', code: -1 },
			{ name: 'One Time', code: 0 },
			{ name: 'One Month', code: 1 },
			{ name: 'Three Months', code: 3 },
			{ name: 'Six Months', code: 6 },
			{ name: 'One Year', code: 12 }
		];
	}
}
