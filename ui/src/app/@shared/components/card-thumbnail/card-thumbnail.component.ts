import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	Input,
	EventEmitter,
	Output
} from '@angular/core';

import SwiperCore, {
	Autoplay,
	Navigation,
	Pagination,
	SwiperOptions,
	EffectCoverflow
} from 'swiper';
SwiperCore.use([Autoplay, Navigation, Pagination]);

import { CarouselData } from '../../interfaces/carousel.interface';
import { TruncatePipe } from '../../pipes/index';

@Component({
	selector: 'mw-card-thumbnail',
	templateUrl: './card-thumbnail.component.html',
	styleUrls: ['./card-thumbnail.component.scss'],
	providers: [TruncatePipe],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardThumbnailComponent implements OnInit {
	@Input() cardData: CarouselData[];
	@Input() isDisplay: boolean;
	@Output() newItemEvent = new EventEmitter<string>();
	maxLenBIO: any;
	readBTN: boolean = true;

	constructor() {}
	ngOnInit(): void {}
	onReadMoreLess(event: any, i: any) {
		if (event === 'M') {
			this.maxLenBIO = this.cardData[i].description.length;
			this.readBTN = false;
		} else {
			this.maxLenBIO = 120;
			this.readBTN = true;
		}
	}
	onCallAction(event: any) {
		this.newItemEvent.emit(event);
	}
}
