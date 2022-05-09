import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { AdminPortalRoutingModule } from './admin-portal-routing.module';
import { AdminPortalComponent } from './landing/admin-portal.component';
import { CompanyListComponent } from './company/list/company-list.component';
import { CompanyDtlComponent } from './company/detail/company-dtl.component';
import { ContentListComponent } from './content/list/content-list.component';
import { CategoryListComponent } from './category/list/category-list.component';
import { CategoryDtlComponent } from './category/detail/category-dtl.component';
import { ProgramApi } from 'src/app/@core/backend/api/site/program.api';
import { ProgramService } from 'src/app/@core/backend/services/site/programs.service';
import { ClassService } from 'src/app/@core/backend/services/class/classes-service.service';
import { ClassServiceApi } from 'src/app/@core/backend/api/class/classes-service.api';
import { GroupServiceApi } from 'src/app/@core/backend/api/group/group-service.api';
import { GroupService } from 'src/app/@core/backend/services/group/group-service.service';
import { ContentDtlComponent } from './content/detail/content-dtl.component';
import { ContentApi } from 'src/app/@core/backend/api/admin/content.api';
import { ContentService } from 'src/app/@core/backend/services/admin/content.service';
import { ClassConfigService } from 'src/app/@core/backend/services/admin/classes.service';
import { ClassConfigApi } from 'src/app/@core/backend/api/admin/classes.api';
import { NonClinicalFBConfigurationComponent } from './non-clinical-configuration/non-clinical-fb/non-clinical-fb-configuration.component';
import { NonClinicalFBOneConfigurationComponent } from './non-clinical-configuration/non-clinical-fb-one/non-clinical-fb-one-configuration.component';
import { OnlineFormApi } from 'src/app/@core/backend/api/admin/form.api';
import { OnlineFormService } from 'src/app/@core/backend/services/admin/form.service';
import { GroupConfigService } from 'src/app/@core/backend/services/admin/groups.service';
import { GroupConfigApi } from 'src/app/@core/backend/api/admin/groups.api';
import { ApptConfigService } from 'src/app/@core/backend/services/admin/appointment.service';
import { ApptConfigApi } from 'src/app/@core/backend/api/admin/appointment.api';
import { CompaniesService } from 'src/app/@core/backend/services/admin/company.service';
import { CompaniesApi } from 'src/app/@core/backend/api/admin/company.api';
import { StaffApi } from 'src/app/@core/backend/api/staff/staff.api';
import { StaffService } from 'src/app/@core/backend/services/staff/staff.service';
import { ProviderListComponent } from './provider/list/provider-list.component';
import { ProviderDtlComponent } from './provider/detail/provider-dtl.component';
import { OnlineFormListComponent } from './online-form/list/online-form-list.component';
import { OnlineFormDetailComponent } from './online-form/detail/online-form-detail.component';
import { CategoriesService } from 'src/app/@core/backend/services/admin/categories.service';
import { CategoriesApi } from 'src/app/@core/backend/api/admin/categories.api';
import { ProviderConfigApi } from 'src/app/@core/backend/api/admin/providers.api';
import { ProviderConfigService } from 'src/app/@core/backend/services/admin/providers.service';
import { GroupDtlComponent } from './group/detail/group-dtl.component';
import { GroupListComponent } from './group/list/group-list.component';
import { PromotionService } from 'src/app/@core/backend/services/admin/promotion.service';
import { PromotionApi } from 'src/app/@core/backend/api/admin/promotion.api';
import { PromotionListComponent } from './promotion/list/promotion-list.component';
import { PromotionAddComponent } from './promotion/add/promotion-add.component';
import { ApppointmentListComponent } from './appointment/list/appointment-list.component';
import { ClassListComponent } from './classes/list/class-list.component';
import { AppointmentDtlComponent } from './appointment/detail/appointment-dtl.component';
import { ClassDtlComponent } from './classes/detail/class-dtl.component';
import { AccessApi } from 'src/app/@core/backend/api/admin/access.api';
import { AccessService } from 'src/app/@core/backend/services/admin/access.service';
import { AccessListComponent } from './access/list/access-list.component';
import { AccessAddComponent } from './access/add/access-add.component';
import { ClientsService } from 'src/app/@core/backend/services/admin/client.service';
import { ClientsApi } from 'src/app/@core/backend/api/admin/client.api';
import { VimeoItemService } from 'src/app/@core/backend/services/selfcare/vimeo/vimeo.service';
import { VimeoItemApi } from 'src/app/@core/backend/api/selfcare/vimeo/vimeo.api';
import { UserListComponent } from './user-profile/list/user-list.component';
import { UserDetailComponent } from './user-profile/detail/user-detail.component';
import { UpdateProfileService } from 'src/app/@core/backend/services/users/update-user-profile.service';
import { UpdateProfileApi } from 'src/app/@core/backend/api/users/update-profile.api';
import { UserApi } from 'src/app/@core/backend/api/admin/user.api';
import { UserService } from 'src/app/@core/backend/services/admin/user.service';
import { UserProfileApi } from 'src/app/@core/backend/api/users/user-profile.api';
import { UserProfileService } from 'src/app/@core/backend/services/users/user-profile.service';

const SERVICES = [
	ProgramService,
	PromotionService,
	ClassService,
	GroupService,
	ContentService,
	ClassConfigService,
	OnlineFormService,
	GroupConfigService,
	ApptConfigService,
	CompaniesService,
	StaffService,
	CategoriesService,
	ProviderConfigService,
	AccessService,
	ClientsService,
	VimeoItemService,
	UpdateProfileService,
	UserService,
	UserProfileService
];
const API = [
	ProgramApi,
	PromotionApi,
	ClassServiceApi,
	GroupServiceApi,
	ContentApi,
	ClassConfigApi,
	OnlineFormApi,
	GroupConfigApi,
	ApptConfigApi,
	CompaniesApi,
	StaffApi,
	CategoriesApi,
	ProviderConfigApi,
	AccessApi,
	ClientsApi,
	VimeoItemApi,
	UpdateProfileApi,
	UserApi,
	UserProfileApi
];
@NgModule({
	declarations: [
		AdminPortalComponent,
		ApppointmentListComponent,
		CompanyListComponent,
		AppointmentDtlComponent,
		CompanyDtlComponent,
		ContentListComponent,
		CategoryListComponent,
		CategoryDtlComponent,
		ClassListComponent,
		ClassDtlComponent,
		GroupListComponent,
		GroupDtlComponent,
		ContentDtlComponent,
		NonClinicalFBConfigurationComponent,
		NonClinicalFBOneConfigurationComponent,
		ProviderDtlComponent,
		ProviderListComponent,
		OnlineFormListComponent,
		OnlineFormDetailComponent,
		PromotionListComponent,
		PromotionAddComponent,
		AccessListComponent,
		AccessAddComponent,
		UserListComponent,
		UserDetailComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		AdminPortalRoutingModule
	],
	providers: [...SERVICES, ...API, DatePipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminPortalModule {}
