import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { ProgramService } from '../../@core/backend/services/site/programs.service';
import { ProgramApi } from '../../@core/backend/api/site/program.api';
import { SessionService } from '../../@core/backend/services/site/session.service';
import { SessionApi } from '../../@core/backend/api/site/session.api';
import { StaffApi } from '../../@core/backend/api/staff/staff.api';
import { StaffService } from '../../@core/backend/services/staff/staff.service';
import { DatePipe } from '@angular/common';
import { LandingClassApi } from '../../@core/backend/api/class/landing.api';
import { LandingClassService } from '../../@core/backend/services/class/landing.service';
import { AvailableTimeApi } from '../../@core/backend/api/group/available.api';
import { AvailableService } from '../../@core/backend/services/group/available.service';
import { ServiceApi } from '../../@core/backend/api/group/service.api';
import { ServicesService } from '../../@core/backend/services/group/services.service';
import { BookableTimeService } from '../../@core/backend/services/group/bookable_time.service';
import { ClientServicesService } from '../../@core/backend/services/group/client_services.service';
import { BookableTimeApi } from '../../@core/backend/api/group/bookable_time.api';
import { ClientServiceApi } from '../../@core/backend/api/group/client_service.api';
import { CalendarService } from '../../@core/backend/services/group/calendar.service';
import { CalendarApi } from '../../@core/backend/api/group/calendar.api';
import { GroupRoutingModule } from './group-routing.module';
import { GroupsComponent } from './landing/groups.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { OtherServiceApi } from '../../@core/backend/api/class/other-service.api';
import { OtherService } from '../../@core/backend/services/class/other-service.service';
import { GroupServiceApi } from '../../@core/backend/api/group/group-service.api';
import { GroupService } from '../../@core/backend/services/group/group-service.service';
import { CreateGroupBookApi } from 'src/app/@core/backend/api/group/create-group-book.api';
import { CreateGroupBookService } from 'src/app/@core/backend/services/group/create-group-book.service';
import { CreateGroupSaleApi } from 'src/app/@core/backend/api/group/create-group-sale.api';
import { CreateGroupSaleService } from 'src/app/@core/backend/services/group/create-group-sale.service';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { CategoriesApi } from 'src/app/@core/backend/api/admin/categories.api';
import { GroupConfigService } from 'src/app/@core/backend/services/admin/groups.service';
import { GroupConfigApi } from 'src/app/@core/backend/api/admin/groups.api';
import { ClassConfigService } from 'src/app/@core/backend/services/admin/classes.service';
import { ClassConfigApi } from 'src/app/@core/backend/api/admin/classes.api';
import { CreateClassBookService } from 'src/app/@core/backend/services/class/create-class-book.service';
import { CreateClassBookApi } from 'src/app/@core/backend/api/class/create-class-book.api';
import { ReqJoinComponent } from './req-join/req-join.component';
import { StripeService } from 'src/app/@core/backend/services/stripe/stripe.service';
import { StripeApi } from 'src/app/@core/backend/api/stripe/stripe.api';
import { ApptJoinService } from 'src/app/@core/backend/services/appointment/appt-join.service';
import { ClassJoinService } from 'src/app/@core/backend/services/class/class-join.service';
import { ApptJoinApi } from 'src/app/@core/backend/api/appointment/appt-join.api';
import { ClassJoinApi } from 'src/app/@core/backend/api/class/class-join.api';
import { GroupJoinService } from 'src/app/@core/backend/services/group/group-join.service';
import { GroupJoinApi } from 'src/app/@core/backend/api/group/group-join.api';
const SERVICES = [
	ProgramService,
	SessionService,
	StaffService,
	AvailableService,
	ServicesService,
	BookableTimeService,
	ClientServicesService,
	LandingClassService,
	GroupService,
	CalendarService,
	OtherService,
	CreateGroupBookService,
	CreateGroupSaleService,
	CategoriesService,
	GroupConfigService,
	ClassConfigService,
	CreateClassBookService,
	StripeService,
	ApptJoinService,
	ClassJoinService,
	GroupJoinService
];
const API = [
	ProgramApi,
	SessionApi,
	StaffApi,
	CreateGroupBookApi,
	AvailableTimeApi,
	ServiceApi,
	BookableTimeApi,
	ClientServiceApi,
	LandingClassApi,
	GroupServiceApi,
	CalendarApi,
	OtherServiceApi,
	CreateGroupSaleApi,
	CategoriesApi,
	GroupConfigApi,
	ClassConfigApi,
	ServiceApi,
	CreateClassBookApi,
	StripeApi,
	ApptJoinApi,
	ClassJoinApi,
	GroupJoinApi
];
@NgModule({
	declarations: [GroupsComponent, CreateGroupComponent, ReqJoinComponent],
	imports: [CommonModule, FormsModule, SharedModule, GroupRoutingModule],
	providers: [...SERVICES, ...API, DatePipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroupModule {}
