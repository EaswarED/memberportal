import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'mworxSafe' })
export class SafePipe implements PipeTransform {
	constructor(private sanitizer: DomSanitizer) {}

	transform(style: string) {
		return this.sanitizer.bypassSecurityTrustHtml(style);
	}
}
