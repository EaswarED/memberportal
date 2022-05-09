import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { ConsultsRoutingModule } from './consult-routing.module';
import { CreateProfileApi } from 'src/app/@core/backend/api/bookconsult/create-profile.api';
import { CreateProfileService } from 'src/app/@core/backend/services/bookconsult/create-profile.service';
import { CalendarBookConsultApi } from 'src/app/@core/backend/api/bookconsult/calendar-bookconsult.api';
import { CalendarBookConsultService } from 'src/app/@core/backend/services/bookconsult/calendar-bookconsult.service';
import { CreateBookConsultClassApi } from 'src/app/@core/backend/api/bookconsult/book-consult-class.api';
import { CreateBookConsultClassService } from 'src/app/@core/backend/services/bookconsult/book-consult-class.service';
import { BookComponent } from './book/book.component';
import { CreateApptBookService } from 'src/app/@core/backend/services/appointment/create-appts-book.service';
import { CreateApptBookApi } from 'src/app/@core/backend/api/appointment/create-appt-book.api';
import { WeeklyViewComponent } from './weekly-view/weekly-view.component';
import { DailyViewComponent } from './daily-view/daily-view.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ConsultComponent } from './consult.component';
const SERVICES = [
	CreateProfileService,
	CalendarBookConsultService,
	CreateBookConsultClassService,
	CreateApptBookService
];
const API = [
	CreateProfileApi,
	CalendarBookConsultApi,
	CreateBookConsultClassApi,
	CreateApptBookApi
];

@NgModule({
	declarations: [
		BookComponent,
		WeeklyViewComponent,
		DailyViewComponent,
		CalendarComponent,
		ConsultComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		ConsultsRoutingModule,
		FlatpickrModule,
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		})
	],
	providers: [...SERVICES, ...API, DatePipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultsModule {}
