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
import { ProgramItem } from '../../interfaces/class.interface';
import { TruncatePipe } from '../../pipes/index';
import { UnderscorePipe } from '../../pipes/index';
@Component({
	selector: 'mw-carousel-card',
	templateUrl: './carousel-card.component.html',
	styleUrls: ['./carousel-card.component.scss'],
	providers: [TruncatePipe, UnderscorePipe],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselCardComponent {
	@Input() carouselData: any;
	@Output() clickEvent = new EventEmitter<string>();

	config: SwiperOptions = {
		cssMode: false,
		slidesPerView: 4,
		loop: false,
		spaceBetween: 50,
		navigation: true,
		grabCursor: true,
		pagination: false,
		centeredSlides: true,
		centeredSlidesBounds: true,
		breakpoints: {
			'300': {
				slidesPerView: 1,
				spaceBetween: 100
			},
			'450': {
				slidesPerView: 1,
				spaceBetween: 100
			},
			'600': {
				slidesPerView: 1,
				spaceBetween: 100
			},
			'960': {
				slidesPerView: 3,
				spaceBetween: 100
			},
			'1280': {
				slidesPerView: 3,
				spaceBetween: 100
			},
			'1920': {
				slidesPerView: 3,
				spaceBetween: 100
			}
		}
	};

	constructor() {}
	handleclick(item: any) {
		this.clickEvent.emit(item);
	}
}
