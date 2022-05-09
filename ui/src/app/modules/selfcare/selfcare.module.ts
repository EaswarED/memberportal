import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { SelfCareComponent } from './landing/selfcare.component';
import { SelfCareInformationComponent } from './selfcare-information/selfcare-information.component';
import { SelfCareRoutingModule } from './selfcare-routing.module';
import { VimeoItemApi } from 'src/app/@core/backend/api/selfcare/vimeo/vimeo.api';
import { VimeoItemService } from 'src/app/@core/backend/services/selfcare/vimeo/vimeo.service';
import { SafePipe } from 'src/app/@shared/pipes';
import { StaffApi } from 'src/app/@core/backend/api/staff/staff.api';
import { StaffService } from 'src/app/@core/backend/services/staff/staff.service';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { CategoriesApi } from 'src/app/@core/backend/api/admin/categories.api';
import { ContentService } from 'src/app/@core/backend/services/admin/content.service';
import { ContentApi } from 'src/app/@core/backend/api/admin/content.api';
import { SiteContentApi } from 'src/app/@core/backend/api/dashboard/site-content.api';
import { SiteContentSerice } from 'src/app/@core/backend/services/dashboard/site-content.service';
import { UiMessagingService } from 'src/app/@core/backend/services/shared/ui-messaging.service';

const SERVICES = [
	VimeoItemService,
	StaffService,
	CategoriesService,
	ContentService,
	SiteContentSerice,
	UiMessagingService
];
const API = [VimeoItemApi, StaffApi, CategoriesApi, ContentApi, SiteContentApi];
@NgModule({
	declarations: [SelfCareComponent, SelfCareInformationComponent],
	imports: [CommonModule, FormsModule, SharedModule, SelfCareRoutingModule],
	providers: [...SERVICES, ...API, DatePipe, SafePipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelfCareModule {}
