import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'count' })
export class CountPipe implements PipeTransform {
	transform(value: any): string {
		if (Array.isArray(value)) return value.length + '';
		return '0';
	}
}
