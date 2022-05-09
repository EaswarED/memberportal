import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CancelSummaryComponent } from '../actions/cancel-summary/cancel-summary.component';
import { ReScheduleComponent } from '../actions/reschedule/reschedule.component';
import { CreateApptComponent } from './create/create-appt.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
	{ path: '', component: LandingComponent },
	{ path: 'create', component: CreateApptComponent },
	{ path: 'cancel', component: CancelSummaryComponent },
	{ path: 're-schedule', component: ReScheduleComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ApptRoutingModule {}
