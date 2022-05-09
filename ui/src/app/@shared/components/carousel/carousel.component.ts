import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	Input,
	Output,
	EventEmitter
} from '@angular/core';

import SwiperCore, {
	Autoplay,
	Navigation,
	SwiperOptions,
	EffectCoverflow
} from 'swiper';

SwiperCore.use([Autoplay, Navigation, EffectCoverflow]);

import { CarouselData } from '../../interfaces/carousel.interface';
import { UnderscorePipe } from '../../pipes';

@Component({
	selector: 'mw-carousel',
	templateUrl: './carousel.component.html',
	styleUrls: ['./carousel.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [UnderscorePipe]
})
export class CarouselComponent {
	@Output() clickEvent = new EventEmitter<string>();
	config: SwiperOptions = {
		cssMode: false,
		loop: true,
		initialSlide: 0,
		loopedSlides: 4,
		spaceBetween: 50,
		navigation: true,
		pagination: false,
		grabCursor: true,
		effect: 'coverflow',
		coverflowEffect: {
			rotate: 10,
			stretch: 0,
			depth: 250,
			modifier: 0.5,
			slideShadows: true
		},
		centeredSlides: true,
		autoplay: {
			delay: 3000,
			disableOnInteraction: true
		},
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
				slidesPerView: 1
			},
			'960': {
				slidesPerView: 3
			},
			'1280': {
				slidesPerView: 4
			},
			'1920': {
				slidesPerView: 5
			}
		}
	};

	@Input() carouselData: CarouselData[];
	constructor() {}
	selfcare(event: any) {
		this.clickEvent.emit(event);
	}
}
