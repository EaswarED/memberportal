import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { ActionsRoutingModule } from './actions-routing.module';
import { JoinNowComponent } from './join-now/join-now.component';
import { ReScheduleComponent } from './reschedule/reschedule.component';
import { CheckInApi } from 'src/app/@core/backend/api/checkin/checkin.api';
import { CheckInService } from 'src/app/@core/backend/services/checkin/checkin.service';
import { GridActionsComponent } from './grid-actions/grid-actions.component';
import { CancelComponent } from './cancel/cancel.component';
import { CancelSummaryComponent } from './cancel-summary/cancel-summary.component';
import { CheckinComponent } from './checkin/checkin.component';
import { ApptJoinApi } from 'src/app/@core/backend/api/appointment/appt-join.api';
import { ApptJoinService } from 'src/app/@core/backend/services/appointment/appt-join.service';
import { DialogCompaniesComponent } from './dialog-companies/dialog-companies.component';
import { ChronoFormService } from 'src/app/@core/backend/services/form/chrono-form.service';
import { ChronoFormApi } from 'src/app/@core/backend/api/form/chrono-form.api';
import { DialogClientComponent } from './dialog-client/dialog-client.component';
import { ClassJoinApi } from 'src/app/@core/backend/api/class/class-join.api';
import { ClassJoinService } from 'src/app/@core/backend/services/class/class-join.service';
import { GroupJoinService } from 'src/app/@core/backend/services/group/group-join.service';
import { GroupJoinApi } from 'src/app/@core/backend/api/group/group-join.api';
import { MessageComponent } from './message/message.component';

const API = [
	CheckInApi,
	ApptJoinApi,
	ChronoFormApi,
	ClassJoinApi,
	GroupJoinApi
];

const SERVICES = [
	CheckInService,
	ApptJoinService,
	ChronoFormService,
	ClassJoinService,
	GroupJoinService
];

@NgModule({
	declarations: [
		CheckinComponent,
		JoinNowComponent,
		CancelSummaryComponent,
		ReScheduleComponent,
		GridActionsComponent,
		CancelComponent,
		DialogCompaniesComponent,
		DialogClientComponent,
		MessageComponent
	],
	imports: [CommonModule, FormsModule, SharedModule, ActionsRoutingModule],
	providers: [...SERVICES, ...API],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActionsModule {}
