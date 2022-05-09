import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BookableTimeService } from 'src/app/@core/backend/services/appointment/bookable_time.service';
import { takeWhile } from 'rxjs/operators';
import { CalendarBookConsultService } from 'src/app/@core/backend/services/bookconsult/calendar-bookconsult.service';
@Component({
	selector: 'mw-weekly-view',
	templateUrl: './weekly-view.component.html',
	styleUrls: ['./weekly-view.component.scss']
})
export class WeeklyViewComponent implements OnInit {
	@Output() weekly = new EventEmitter<any>();
	private alive = true;
	public currentPage: any = 0;
	selectedBooking: any;
	isLoading: boolean = true;
	started: number = 0;
	ended: number = 5;
	header_date: any;
	result_date: any;
	calendarConsult: any = [];

	constructor(
		private calendarBookConsultService: CalendarBookConsultService
	) {}

	ngOnInit(): void {
		this.load_data();
	}

	load_data() {
		const currentDate = new Date();
		this.header_date = this.methodMonYear(
			currentDate.getFullYear(),
			currentDate.getMonth() + 1,
			currentDate.getDate()
		);

		this.calendarBookConsultService
			.GetCalendarBookConsult()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.isLoading = false;
				this.header_date.forEach((element_date: any) => {
					this.calendarConsult = [];
					data.forEach((element: any) => {
						if (
							element_date.date_string ===
							new Date(element.startDate).toLocaleDateString(
								'en-US',
								{ timeZone: 'UTC' }
							)
						) {
							this.calendarConsult.push(element);
						}
						element_date['items'] = this.calendarConsult;
					});
				});
				this.result_date = this.header_date.slice(
					this.started,
					this.ended
				);
			});
	}

	methodMonYear(year: any, month: any, day: any, data?: any) {
		var monthIndex = month - 1;
		var names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		var date = new Date(year, monthIndex, day);
		var result = [];
		while (date.getMonth() == monthIndex) {
			if (!data) {
				result.push({
					date_string: date.toLocaleDateString('en-US', {
						timeZone: 'UTC'
					}),
					date_format: date.getDate() + ' ' + names[date.getDay()]
				});
			} else {
				if (
					new Date(date).toLocaleDateString() ==
					new Date(data.startDate).toLocaleDateString()
				) {
					result.push({
						date_string: date.toLocaleDateString('en-US', {
							timeZone: 'UTC'
						}),
						date_format:
							date.getDate() + ' ' + names[date.getDay()],
						items: data
					});
				} else {
					result.push({
						date_string: date.toLocaleDateString('en-US', {
							timeZone: 'UTC'
						}),
						date_format:
							date.getDate() + ' ' + names[date.getDay()],
						items: {}
					});
				}
			}
			date.setDate(date.getDate() + 1);
		}
		return result;
	}

	changePage(index: number, startIndex: number, endIndex: number): void {
		this.started += index;
		this.ended += index;

		if (this.result_date.length == 0) {
			this.result_date = this.header_date.slice(0, 5);
		} else {
			this.result_date = this.header_date.slice(this.started, this.ended);
		}
	}

	onOpenTime(event: any) {
		this.weekly.emit(event);
		this.selectedBooking = event.time;
	}
}
