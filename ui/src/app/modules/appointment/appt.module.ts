import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { ApptRoutingModule } from './appt-routing.module';
import { ProgramService } from 'src/app/@core/backend/services/site/programs.service';
import { ProgramApi } from 'src/app/@core/backend/api/site/program.api';
import { SessionService } from 'src/app/@core/backend/services/site/session.service';
import { SessionApi } from 'src/app/@core/backend/api/site/session.api';
import { StaffApi } from 'src/app/@core/backend/api/staff/staff.api';
import { StaffService } from 'src/app/@core/backend/services/staff/staff.service';
import { AvailableTimeApi } from 'src/app/@core/backend/api/appointment/available.api';
import { AvailableService } from 'src/app/@core/backend/services/appointment/available.service';
import { DatePipe } from '@angular/common';
import { ServiceApi } from 'src/app/@core/backend/api/appointment/service.api';
import { ServicesService } from 'src/app/@core/backend/services/appointment/services.service';
import { BookableTimeApi } from 'src/app/@core/backend/api/appointment/bookable_time.api';
import { BookableTimeService } from 'src/app/@core/backend/services/appointment/bookable_time.service';
import { ClientServiceApi } from 'src/app/@core/backend/api/appointment/client_service.api';
import { ClientServicesService } from 'src/app/@core/backend/services/appointment/client_services.service';
import { LandingApptApi } from 'src/app/@core/backend/api/appointment/landing.api';
import { LandingApptService } from 'src/app/@core/backend/services/appointment/landing.service';
import { RecommendService } from 'src/app/@core/backend/services/dashboard/recommend.service';
import { RecommendApi } from 'src/app/@core/backend/api/dashboard/recommend.api';
import { CreateApptSaleApi } from 'src/app/@core/backend/api/appointment/create-appt-sale.api';
import { CreateApptSaleService } from 'src/app/@core/backend/services/appointment/create-appts-sale.service';
import { OtherService } from 'src/app/@core/backend/services/appointment/other-service.service';
import { OtherServiceApi } from 'src/app/@core/backend/api/appointment/other-service.api';
import { ClassServiceApi } from 'src/app/@core/backend/api/appointment/classes-service.api';
import { ClassService } from 'src/app/@core/backend/services/appointment/classes-service.service';
import { CreateApptBookApi } from 'src/app/@core/backend/api/appointment/create-appt-book.api';
import { CreateApptBookService } from 'src/app/@core/backend/services/appointment/create-appts-book.service';
import { ApptCancelService } from 'src/app/@core/backend/services/appointment/appt-cancel.service';
import { ApptCancelApi } from 'src/app/@core/backend/api/appointment/appt-cancel.api';
import { LandingComponent } from './landing/landing.component';
import { CreateApptComponent } from './create/create-appt.component';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { CategoriesApi } from 'src/app/@core/backend/api/admin/categories.api';
import { ApptConfigService } from 'src/app/@core/backend/services/admin/appointment.service';
import { ApptConfigApi } from 'src/app/@core/backend/api/admin/appointment.api';
import { StripeService } from 'src/app/@core/backend/services/stripe/stripe.service';
import { StripeApi } from 'src/app/@core/backend/api/stripe/stripe.api';
import { ApptJoinApi } from 'src/app/@core/backend/api/appointment/appt-join.api';
import { ClassJoinApi } from 'src/app/@core/backend/api/class/class-join.api';
import { ApptJoinService } from 'src/app/@core/backend/services/appointment/appt-join.service';
import { ClassJoinService } from 'src/app/@core/backend/services/class/class-join.service';
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
	LandingApptService,
	RecommendService,
	CreateApptSaleService,
	OtherService,
	ClassService,
	CreateApptBookService,
	ApptCancelService,
	CategoriesService,
	ApptConfigService,
	StripeService,
	ApptJoinService,
	ClassJoinService,
	GroupJoinService
];
const API = [
	ProgramApi,
	SessionApi,
	StaffApi,
	AvailableTimeApi,
	ServiceApi,
	BookableTimeApi,
	ClientServiceApi,
	LandingApptApi,
	RecommendApi,
	CreateApptSaleApi,
	OtherServiceApi,
	ClassServiceApi,
	CreateApptBookApi,
	ApptCancelApi,
	CategoriesApi,
	ApptConfigApi,
	StripeApi,
	ApptJoinApi,
	ClassJoinApi,
	GroupJoinApi
];
@NgModule({
	declarations: [LandingComponent, CreateApptComponent],
	imports: [CommonModule, FormsModule, SharedModule, ApptRoutingModule],
	providers: [...SERVICES, ...API, DatePipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ApptModule {}
