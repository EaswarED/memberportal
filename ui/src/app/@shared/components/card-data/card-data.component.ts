import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Logger } from '../../utils/logger';

@Component({
	selector: 'mw-card-data',
	templateUrl: './card-data.component.html',
	styleUrls: ['./card-data.component.scss']
})
export class CardDataComponent implements OnInit {
	mySubscription: any;
	description =
		'Session that will blast your muscles and get you ready for that bathing suit! Cost is $400 up front! Cancelation policy is 48 hours for a full refund.';

	constructor() {}

	@Input() cardList: any[];
	@Input() title: string;
	@Output() closeEvent = new EventEmitter<string>();
	@Output() doActions = new EventEmitter<string>();

	selectedCard: any;

	ngOnInit(): void {
		this.selectedCard = this.cardList[0];
	}

	goBack() {
		this.closeEvent.emit();
	}

	onCardSelect(card: any) {
		this.selectedCard = card;
	}

	doAction() {
		this.doActions.emit(this.selectedCard);
	}
}
