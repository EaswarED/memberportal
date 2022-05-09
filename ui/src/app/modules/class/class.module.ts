import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { ClassRoutingModule } from './class-routing.module';
import { ClassComponent } from './landing/class.component';
import { ProgramService } from 'src/app/@core/backend/services/site/programs.service';
import { ProgramApi } from 'src/app/@core/backend/api/site/program.api';
import { SessionService } from 'src/app/@core/backend/services/site/session.service';
import { SessionApi } from 'src/app/@core/backend/api/site/session.api';
import { StaffApi } from 'src/app/@core/backend/api/staff/staff.api';
import { StaffService } from 'src/app/@core/backend/services/staff/staff.service';
import { DatePipe } from '@angular/common';
import { LandingClassApi } from 'src/app/@core/backend/api/class/landing.api';
import { LandingClassService } from 'src/app/@core/backend/services/class/landing.service';
import { OtherService } from 'src/app/@core/backend/services/class/other-service.service';
import { OtherServiceApi } from 'src/app/@core/backend/api/class/other-service.api';
import { ClassService } from 'src/app/@core/backend/services/class/classes-service.service';
import { ClassServiceApi } from 'src/app/@core/backend/api/class/classes-service.api';
import { CreateClassComponent } from './create-class/create-class.component';
import { AvailableService } from 'src/app/@core/backend/services/class/available.service';
import { AvailableTimeApi } from 'src/app/@core/backend/api/class/available.api';
import { ServiceApi } from 'src/app/@core/backend/api/class/service.api';
import { ServicesService } from 'src/app/@core/backend/services/class/services.service';
import { BookableTimeService } from 'src/app/@core/backend/services/class/bookable_time.service';
import { ClientServicesService } from 'src/app/@core/backend/services/class/client_services.service';
import { BookableTimeApi } from 'src/app/@core/backend/api/class/bookable_time.api';
import { ClientServiceApi } from 'src/app/@core/backend/api/class/client_service.api';
import { CalendarService } from 'src/app/@core/backend/services/class/calendar.service';
import { CalendarApi } from 'src/app/@core/backend/api/class/calendar.api';
import { CreateClassBookService } from 'src/app/@core/backend/services/class/create-class-book.service';
import { CreateClassBookApi } from 'src/app/@core/backend/api/class/create-class-book.api';
import { CreateClassSaleService } from 'src/app/@core/backend/services/class/create-class-sale.service';
import { CreateClassSaleApi } from 'src/app/@core/backend/api/class/create-class-sale.api';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { CategoriesApi } from 'src/app/@core/backend/api/admin/categories.api';
import { ClassConfigService } from 'src/app/@core/backend/services/admin/classes.service';
import { ClassConfigApi } from 'src/app/@core/backend/api/admin/classes.api';
import { StripeService } from 'src/app/@core/backend/services/stripe/stripe.service';
import { StripeApi } from 'src/app/@core/backend/api/stripe/stripe.api';
import { ApptJoinService } from 'src/app/@core/backend/services/appointment/appt-join.service';
import { ApptJoinApi } from 'src/app/@core/backend/api/appointment/appt-join.api';
import { ClassJoinApi } from 'src/app/@core/backend/api/class/class-join.api';
import { ClassJoinService } from 'src/app/@core/backend/services/class/class-join.service';
import { GroupJoinApi } from 'src/app/@core/backend/api/group/group-join.api';
import { GroupJoinService } from 'src/app/@core/backend/services/group/group-join.service';

const SERVICES = [
	ProgramService,
	SessionService,
	StaffService,
	AvailableService,
	ServicesService,
	BookableTimeService,
	ClientServicesService,
	LandingClassService,
	OtherService,
	ClassService,
	CalendarService,
	CreateClassBookService,
	CreateClassSaleService,
	CategoriesService,
	ClassConfigService,
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
	LandingClassApi,
	OtherServiceApi,
	ClassServiceApi,
	CalendarApi,
	CreateClassBookApi,
	CreateClassSaleApi,
	CategoriesApi,
	ClassConfigApi,
	StripeApi,
	ApptJoinApi,
	ClassJoinApi,
	GroupJoinApi
];

@NgModule({
	declarations: [ClassComponent, CreateClassComponent],
	imports: [CommonModule, FormsModule, SharedModule, ClassRoutingModule],
	providers: [...SERVICES, ...API, DatePipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClassModule {}
