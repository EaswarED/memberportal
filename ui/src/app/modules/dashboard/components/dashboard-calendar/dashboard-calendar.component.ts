import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogData } from 'src/app/@shared/interfaces/dialog-data.interface';
import { Logger } from 'src/app/@shared/utils/logger';

@Component({
	selector: 'mw-dashboard-calendar',
	templateUrl: './dashboard-calendar.component.html',
	styleUrls: ['./dashboard-calendar.component.scss']
})
export class DashboardCalendarComponent implements OnInit {
	constructor(
		private router: Router,
		public dialogRef: MatDialogRef<DashboardCalendarComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) {}
	calendarDashboardData: any;
	apptCount: number | any;
	classCount: number | any;
	groupCount: number | any;

	ngOnInit(): void {
		this.calendarDashboardData = this.data.item;
		this.apptCount = this.data.onApptCount;
		this.classCount = this.data.onClassCount;
		this.groupCount = this.data.onGroupCount;
		Logger.debug(this.calendarDashboardData);
	}
	gotoApptsLanding() {
		this.router.navigate(['/modules/appt']);
	}
	gotoClassLanding() {
		this.router.navigate(['/modules/class']);
	}
	gotoGroupLanding() {
		this.router.navigate(['/modules/group']);
	}
}
