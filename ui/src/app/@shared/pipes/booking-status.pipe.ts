import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../utils/constants';
import { UIUtil } from '../utils/ui-util';

@Pipe({ name: 'bookingStatusButtonAccent' })
export class BookingStatusButtonAccentPipe implements PipeTransform {
	transform(bookingId: number): string {
		if (bookingId > 0) {
			return 'mat-accent';
		}
		return 'mat-primary dash-card__btn';
	}
}

@Pipe({ name: 'bookingStatusButtonInline' })
export class BookingStatusButtonInlinePipe implements PipeTransform {
	transform(bookingId: number): boolean {
		if (bookingId === 0) {
			return true;
		}
		return false;
	}
}

@Pipe({ name: 'bookingStatusLabel' })
export class BookingStatusLabelPipe implements PipeTransform {
	transform(
		startDateTime: string,
		isGroup?: boolean,
		item?: any,
		type?: any
	): string | null {
		let label = UIUtil.getBookingStatusLabel(startDateTime, item, type);
		if (item?.AppointmentStatus === Constants.LABEL_BUTTON_CANCELLED) {
			return null;
		}
		if (isGroup) {
			if (item.IsPending === true) {
				return Constants.LABEL_BUTTON_JOIN_PENDING;
			} else if (item.IsApproved === false) {
				return Constants.LABEL_BUTTON_JOIN_REQUEST;
			} else if (label) {
				return label;
			}
			return null;
		}
		if (label) {
			return label;
		} else {
			return null;
		}
	}
}
