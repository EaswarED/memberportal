import {
	ModuleWithProviders,
	NgModule,
	CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { SwiperModule } from 'swiper/angular';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { CardComponent } from './components/card/card.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { UiMessagingService } from '../@core/backend/services/shared/ui-messaging.service';
import {
	BookingStatusButtonAccentPipe,
	BookingStatusLabelPipe,
	CallbackPipe,
	CountdownPipe,
	TruncatePipe,
	BooleanFlagPipe,
	CountPipe
} from './pipes/index';
import { SafePipe } from './pipes/index';
import { CarouselCardComponent } from './components/carousel-card/carousel-card.component';
import { DialogOverviewComponent } from './components/dialog-overview/dialog-overview.component';
import { ConfirmCancelComponent } from './components/confirm-cancel/confirm-cancel.component';
import { CardDataComponent } from './components/card-data/card-data.component';
import { CardThumbnailComponent } from './components/card-thumbnail/card-thumbnail.component';
import { CalendarDataComponent } from './components/calendar-data/calendar-data.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { LandingApptService } from '../@core/backend/services/appointment/landing.service';
import { LandingClassService } from '../@core/backend/services/class/landing.service';
import { LandingGroupService } from '../@core/backend/services/group/landing.service';
import { LandingApptApi } from '../@core/backend/api/appointment/landing.api';
import { LandingClassApi } from '../@core/backend/api/class/landing.api';
import { LandingGroupApi } from '../@core/backend/api/group/landing.api';
import { UnderscorePipe } from './pipes/underscore.pipe';
import { ApptCancelApi } from '../@core/backend/api/appointment/appt-cancel.api';
import { ApptCancelService } from '../@core/backend/services/appointment/appt-cancel.service';
import { ClassCancelApi } from '../@core/backend/api/class/class-cancel.api';
import { ClassCancelService } from '../@core/backend/services/class/class-cancel.service';
import { NotificationApi } from '../@core/backend/api/users/notification.api';
import { NotificationService } from 'src/app/@core/backend/services/users/notification.service';
import { DataGridActionsComponent } from './components/data-grid-actions/data-grid-actions.component';
import { ClassTypeLabelPipe } from './pipes/classType-label.pipe';
import { ContentTypeLabelPipe } from './pipes/contentType-label.pipe';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { DialogSuccessComponent } from './components/dialog-success/dialog-success.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BookableTimeService } from '../@core/backend/services/appointment/bookable_time.service';
import { BookableTimeApi } from '../@core/backend/api/appointment/bookable_time.api';
import { LoginComponent } from './components/login/login.component';

FullCalendarModule.registerPlugins([dayGridPlugin, interactionPlugin]);

const SHARED_COMPONENTS = [
	HeaderComponent,
	FooterComponent,
	MenuComponent,
	CardComponent,
	CarouselComponent,
	DataTableComponent,
	CarouselCardComponent,
	DialogOverviewComponent,
	CardDataComponent,
	CardThumbnailComponent,
	CalendarDataComponent,
	ConfirmCancelComponent,
	DataGridActionsComponent,
	DialogConfirmComponent,
	DialogSuccessComponent,
	DialogFormComponent,
	LoginComponent,
	SidebarComponent
];

const DIALOGS = [];

const PIPES = [
	TruncatePipe,
	UnderscorePipe,
	SafePipe,
	BookingStatusButtonAccentPipe,
	BookingStatusLabelPipe,
	CountdownPipe,
	ClassTypeLabelPipe,
	ContentTypeLabelPipe,
	CallbackPipe,
	BooleanFlagPipe,
	CountPipe
];

const PROVIDERS = [
	UiMessagingService,
	LandingApptService,
	LandingClassService,
	LandingGroupService,
	LandingApptApi,
	LandingClassApi,
	LandingGroupApi,
	ApptCancelApi,
	ApptCancelService,
	ClassCancelApi,
	ClassCancelService,
	NotificationService,
	NotificationApi,
	BookableTimeService,
	BookableTimeApi
];

const VALIDATORS = [];

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MaterialModule,
		AgGridModule.withComponents([]),
		SwiperModule,
		FullCalendarModule
	],
	exports: [MaterialModule, ...SHARED_COMPONENTS, ...PIPES],
	providers: [...PROVIDERS],
	declarations: [...SHARED_COMPONENTS, ...PIPES, DialogOverviewComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule
		};
	}
}
