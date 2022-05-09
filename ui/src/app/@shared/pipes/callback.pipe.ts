import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'callback' })
export class CallbackPipe implements PipeTransform {
	transform(
		value: any,
		callback: (val: any, context?: any) => {},
		context?: any
	): any {
		return callback(value, context);
	}
}
