import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { DataGridNameComponent } from '../../@shared/components/data-grid/name/data-grid-name.component';
import { RecommendApi } from 'src/app/@core/backend/api/dashboard/recommend.api';
import { RecommendService } from 'src/app/@core/backend/services/dashboard/recommend.service';
import {
	StatusButtonAccentPipe,
	StatusButtonInlinePipe
} from 'src/app/@shared/pipes';
import { UpcomingService } from 'src/app/@core/backend/services/dashboard/upcoming.service';
import { UpcomingApi } from 'src/app/@core/backend/api/dashboard/upcoming.api';
import { DataGridDateComponent } from '../../@shared/components/data-grid/date/data-grid-date.component';
import { DashboardCalendarComponent } from './components/dashboard-calendar/dashboard-calendar.component';
import { SiteContentApi } from 'src/app/@core/backend/api/dashboard/site-content.api';
import { SiteContentSerice } from 'src/app/@core/backend/services/dashboard/site-content.service';
import { ApptJoinApi } from 'src/app/@core/backend/api/appointment/appt-join.api';
import { ApptJoinService } from 'src/app/@core/backend/services/appointment/appt-join.service';
import { ClassJoinService } from 'src/app/@core/backend/services/class/class-join.service';
import { ClassJoinApi } from 'src/app/@core/backend/api/class/class-join.api';
import { GroupJoinApi } from 'src/app/@core/backend/api/group/group-join.api';
import { GroupJoinService } from 'src/app/@core/backend/services/group/group-join.service';

const API = [
	RecommendApi,
	UpcomingApi,
	SiteContentApi,
	ApptJoinApi,
	ClassJoinApi,
	GroupJoinApi
];

const SERVICES = [
	RecommendService,
	UpcomingService,
	SiteContentSerice,
	ApptJoinService,
	ClassJoinService,
	GroupJoinService
];

const PIPES = [StatusButtonAccentPipe, StatusButtonInlinePipe];

@NgModule({
	declarations: [
		DashboardComponent,
		DashboardCardComponent,
		DashboardCalendarComponent,
		DataGridNameComponent,
		DataGridDateComponent,
		...PIPES
	],
	imports: [CommonModule, FormsModule, DashboardRoutingModule, SharedModule],
	providers: [...SERVICES, ...API],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {}
