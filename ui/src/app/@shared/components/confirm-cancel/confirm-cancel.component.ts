import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LandingApptService } from 'src/app/@core/backend/services/appointment/landing.service';
import { LandingClassService } from 'src/app/@core/backend/services/class/landing.service';
import { DialogOverviewComponent } from 'src/app/@shared/components/dialog-overview/dialog-overview.component';
import { LandingGroupService } from 'src/app/@core/backend/services/group/landing.service';
import { ApptCancelService } from 'src/app/@core/backend/services/appointment/appt-cancel.service';
import { ClassCancelService } from 'src/app/@core/backend/services/class/class-cancel.service';
@Component({
	selector: 'mw-confirm-cancel',
	templateUrl: './confirm-cancel.component.html',
	styleUrls: ['./confirm-cancel.component.scss']
})
export class ConfirmCancelComponent implements OnInit {
	code: any;
	data: any;
	tableData: any;
	title: any;
	constructor(
		private router: Router,
		private dialog: MatDialog,
		private landingApptService: LandingApptService,
		private landingClassService: LandingClassService,
		private landingGrouService: LandingGroupService,
		private apptCancelService: ApptCancelService,
		private classCancelService: ClassCancelService
	) {}

	ngOnInit(): void {
		this.code = history.state.data.code;
		this.data = history.state.data.type;
		this.title = history.state.data.title;
		this.load_data();
	}

	load_data(): void {
		if (this.code == 'A') {
			this.landingApptService.getLandinglist().subscribe((data) => {
				this.tableData = data.filter(
					(type: any) => type.appointmentId == this.data.appointmentId
				);
			});
		} else if (this.code == 'G') {
			this.landingGrouService.getLandinglist().subscribe((data) => {
				this.tableData = data.filter(
					(type: any) => type.classId == this.data.classId
				);
			});
		} else {
			this.landingClassService.getLandinglist().subscribe((data) => {
				this.tableData = data.filter(
					(type: any) => type.classId == this.data.classId
				);
			});
		}
	}

	onYesClass(event: any, item: any) {
		if (event == 'A') {
			const payload = {
				AppointmentId: item.appointmentId,
				Execute: 'LateCancel',
				Test: false
			};
			this.apptCancelService.AddApptCancel(payload).subscribe((data) => {
				if (data.status !== 200) {
					this.router.navigate(['/modules/appt']).then();
					const dialogRef = this.dialog.open(
						DialogOverviewComponent,
						{
							width: '500px',
							autoFocus: false,
							panelClass: 'mw-class-section',
							data: { name: 'CancelledAppt', type: '' }
						}
					);
				} else {
				}
			});
		} else if (event == 'G') {
			this.router.navigate(['/modules/groups']).then();
			const dialogRef = this.dialog.open(DialogOverviewComponent, {
				width: '500px',
				autoFocus: false,
				panelClass: 'mw-class-section',
				data: { name: 'CancelledGroup', type: '' }
			});

			dialogRef.afterClosed().subscribe((result) => {});
		} else {
			const payload = {
				ClientId: 100015626,
				ClassId: item.classId,
				SendEmail: true,
				LateCancel: true,
				Test: false
			};

			this.classCancelService
				.AddClassCancel(payload)
				.subscribe((data) => {
					if (data.status !== 200) {
						this.router.navigate(['/modules/classes']).then();
						const dialogRef = this.dialog.open(
							DialogOverviewComponent,
							{
								width: '500px',
								autoFocus: false,
								panelClass: 'mw-class-section',
								data: { name: 'CancelledClass', type: '' }
							}
						);
					} else {
					}
				});
		}
	}

	onNoClass(event: any) {
		if (event == 'A') {
			this.router.navigate(['/modules/appt']).then();
		} else if (event == 'G') {
			this.router.navigate(['/modules/groups']).then();
		} else {
			this.router.navigate(['/modules/classes']).then();
		}
	}
}
