import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusButtonAccent' })
export class StatusButtonAccentPipe implements PipeTransform {
	transform(value: string): string {
		if (value === 'Booked') {
			return 'mat-accent';
		}
		return 'mat-primary';
	}
}

@Pipe({ name: 'statusButtonInline' })
export class StatusButtonInlinePipe implements PipeTransform {
	transform(value: string): boolean {
		if (value === 'Booked') {
			return true;
		}
		return false;
	}
}
