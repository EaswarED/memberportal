import {
	Component,
	ChangeDetectionStrategy,
	ViewChild,
	TemplateRef,
	ViewEncapsulation,
	EventEmitter,
	Output,
	OnInit,
	ChangeDetectorRef
} from '@angular/core';
import {
	startOfDay,
	endOfDay,
	subDays,
	addDays,
	endOfMonth,
	isSameDay,
	isSameMonth,
	addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import {
	CalendarEvent,
	CalendarEventAction,
	CalendarEventTimesChangedEvent,
	CalendarMonthViewDay,
	CalendarView
} from 'angular-calendar';
import { StylesCompileDependency } from '@angular/compiler';
import { CalendarBookConsultService } from 'src/app/@core/backend/services/bookconsult/calendar-bookconsult.service';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'mw-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
	private alive = true;
	isLoading: boolean = true;

	@Output() doActions = new EventEmitter<any>();
	view: CalendarView = CalendarView.Week;

	CalendarView = CalendarView;

	viewDate: Date = new Date();

	getTime: any;
	refresh: Subject<any> = new Subject();

	events: any = [];
	activeDayIsOpen: boolean = true;

	constructor(
		private calendarBookConsultService: CalendarBookConsultService,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.load_data();
	}

	load_data() {
		this.calendarBookConsultService
			.GetCalendarBookConsult()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				if (data) {
					data.forEach((item: any) => {
						this.events.push({
							start: new Date(
								item.startDate + ' ' + item.startTime
							),
							end: new Date(item.endDate + ' ' + item.endtime),
							title: item.startTime + ' ' + item.sessionName,
							datas: item
						});
						this.isLoading = false;
					});
					this.refresh.next();
				}
			});
	}

	dayClicked({
		date,
		events
	}: {
		date: Date;
		events: CalendarEvent[];
	}): void {
		if (isSameMonth(date, this.viewDate)) {
			if (
				(isSameDay(this.viewDate, date) &&
					this.activeDayIsOpen === true) ||
				events.length === 0
			) {
				this.activeDayIsOpen = false;
			} else {
				this.activeDayIsOpen = true;
			}
			this.viewDate = date;
		}
	}

	handleEvent(event: CalendarEvent): void {
		const index = this.events.findIndex(
			(x: any) => x.cssClass == 'cal-day-selected'
		);
		if (this.events[index]) this.events[index].cssClass = '';
		event.cssClass = 'cal-day-selected';
		this.doActions.emit(event);
		this.refresh.next();
	}

	setView(view: CalendarView) {
		this.view = view;
	}

	closeOpenMonthViewDay() {
		this.activeDayIsOpen = false;
	}
}
