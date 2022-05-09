import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../utils/constants';

@Pipe({ name: 'contentTypeLabel' })
export class ContentTypeLabelPipe implements PipeTransform {
	transform(contentType: string): string {
		switch (contentType) {
			case Constants.CONTENT_TYPE_VIDEO:
				return 'Video';
				break;
			case Constants.CONTENT_TYPE_PDF:
				return 'PDF';
				break;
			default:
				return '';
				break;
		}
	}
}
