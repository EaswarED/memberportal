import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../utils/constants';
import { UIUtil } from '../utils/ui-util';
import { Util } from '../utils/util';

@Pipe({ name: 'classTypeLabel' })
export class ClassTypeLabelPipe implements PipeTransform {
	transform(classType: string): string {
		switch (classType) {
			case Constants.CLASS_TYPE_APPOINTMENT:
				return 'Appointment';
				break;
			case Constants.CLASS_TYPE_CLASS:
				return 'Class';
				break;
			case Constants.CLASS_TYPE_GROUP:
				return 'Group';
				break;
			case Constants.CLASS_TYPE_CONTENT:
				return 'Content';
				break;
			default:
				return '';
				break;
		}
	}
}
