import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '../utils/util';

@Pipe({ name: 'booleanFlag' })
export class BooleanFlagPipe implements PipeTransform {
	transform(value: string): string {
		if (value) return 'Yes';
		else if (Util.isNull(value)) return '';
		else return 'No';
	}
}
