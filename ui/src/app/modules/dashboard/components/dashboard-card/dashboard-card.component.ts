import {
	Component,
	ChangeDetectionStrategy,
	Input,
	EventEmitter,
	Output,
	OnInit,
	ChangeDetectorRef,
	OnChanges,
	SimpleChanges
} from '@angular/core';
import { CardItem } from '../../../../@shared/interfaces/card.interface';
import { Constants } from 'src/app/@shared/utils/constants';
import { Logger } from 'src/app/@shared/utils/logger';
@Component({
	selector: 'mw-dashboard-card',
	templateUrl: './dashboard-card.component.html',
	styleUrls: ['./dashboard-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardCardComponent implements OnInit, OnChanges {
	@Input() classType: string;
	@Input() isLoading: boolean;
	@Input() cardItems: CardItem[];

	@Output() btnClicked: EventEmitter<any> = new EventEmitter<any>();
	@Output() refreshCard: EventEmitter<any> = new EventEmitter<any>();
	@Input() selectedItem: any;
	title: string;
	CONST = Constants;
	isGroup: boolean = false;

	constructor(private cd: ChangeDetectorRef) {}

	ngOnInit(): void {
		switch (this.classType) {
			case Constants.CLASS_TYPE_APPOINTMENT:
				this.title = 'My Appointments';
				break;

			case Constants.CLASS_TYPE_CLASS:
				this.title = 'My Classes';
				break;

			case Constants.CLASS_TYPE_GROUP:
				this.title = 'My Groups';
				this.isGroup = true;
				break;
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.cd.detectChanges();
	}

	handleClick(rowData: any, label?: any) {
		const emitData = {
			classType: this.classType,
			data: rowData,
			label: label
		};
		this.btnClicked.emit(emitData);
	}

	watchBookingStatus(countdownStr: string, context: any): string {
		if (Constants.COUNTDOWN_TRIGGER_PATTERNS.includes(countdownStr)) {
			context.refreshCard.emit(context.classType);
		}
		return countdownStr;
	}
}
