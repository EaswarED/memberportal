import { Pipe, PipeTransform } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Constants } from '../utils/constants';
import { Util } from '../utils/util';

@Pipe({ name: 'countdown' })
export class CountdownPipe implements PipeTransform {
	public transform(futureDate: string): Observable<any> | null {
		if (!futureDate || Util.getMsRemaining(futureDate) < 0) {
			return null;
		}
		return timer(0, Constants.COUNTDOWN_MILLI_SECONDS).pipe(
			map(() => {
				return Util.getCountdown(futureDate);
			})
		);
	}
}
