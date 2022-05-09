import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
	selector: 'mw-calendar-data',
	templateUrl: './calendar-data.component.html',
	styleUrls: ['./calendar-data.component.scss']
})
export class CalendarDataComponent implements OnInit {
	@Input() calendarData: [];
	constructor(
		private router: Router,
		public dialogRef: MatDialogRef<CalendarDataComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any
	) {}
	calendarOptions: CalendarOptions;
	@Output() onCalendarEventClick = new EventEmitter<number>();
	@Output() onCalendarEventClicks = new EventEmitter<number>();

	handleDateClicks(arg: any) {
		this.onCalendarEventClicks.emit(arg.event);
	}

	handleDateClick(arg: any) {
		this.onCalendarEventClick.emit(arg);
	}
	ngOnInit(): void {
		this.calendarOptions = {
			initialView: 'dayGridMonth',
			headerToolbar: {
				left: '',
				right: 'prev,title,next'
			},
			dateClick: this.handleDateClick.bind(this),
			events: this.dialogData?.item
				? this.dialogData?.item
				: this.dialogData,
			eventClick: this.handleDateClicks.bind(this)
		};
	}
}
