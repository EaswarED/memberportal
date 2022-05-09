import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPortalComponent } from './landing/admin-portal.component';
import { CompanyListComponent } from './company/list/company-list.component';
import { CompanyDtlComponent } from './company/detail/company-dtl.component';
import { ContentListComponent } from './content/list/content-list.component';
import { CategoryListComponent } from './category/list/category-list.component';
import { CategoryDtlComponent } from './category/detail/category-dtl.component';
import { ContentDtlComponent } from './content/detail/content-dtl.component';
import { NonClinicalFBConfigurationComponent } from './non-clinical-configuration/non-clinical-fb/non-clinical-fb-configuration.component';
import { NonClinicalFBOneConfigurationComponent } from './non-clinical-configuration/non-clinical-fb-one/non-clinical-fb-one-configuration.component';
import { ProviderListComponent } from './provider/list/provider-list.component';
import { ProviderDtlComponent } from './provider/detail/provider-dtl.component';
import { OnlineFormListComponent } from './online-form/list/online-form-list.component';
import { GroupDtlComponent } from './group/detail/group-dtl.component';
import { GroupListComponent } from './group/list/group-list.component';
import { PromotionListComponent } from './promotion/list/promotion-list.component';
import { PromotionAddComponent } from './promotion/add/promotion-add.component';
import { ApppointmentListComponent } from './appointment/list/appointment-list.component';
import { ClassListComponent } from './classes/list/class-list.component';
import { AppointmentDtlComponent } from './appointment/detail/appointment-dtl.component';
import { ClassDtlComponent } from './classes/detail/class-dtl.component';
import { AccessListComponent } from './access/list/access-list.component';
import { AccessAddComponent } from './access/add/access-add.component';
import { UserListComponent } from './user-profile/list/user-list.component';
import { UserDetailComponent } from './user-profile/detail/user-detail.component';
const routes: Routes = [
	{ path: '', component: AdminPortalComponent },
	{
		path: 'appointments',
		component: ApppointmentListComponent
	},

	{
		path: 'appointment',
		component: AppointmentDtlComponent
	},
	{
		path: 'appointment/:id',
		component: AppointmentDtlComponent
	},
	{
		path: 'companies',
		component: CompanyListComponent
	},
	{
		path: 'company',
		component: CompanyDtlComponent
	},
	{
		path: 'company/:id',
		component: CompanyDtlComponent
	},
	{
		path: 'categories',
		component: CategoryListComponent
	},
	{
		path: 'category',
		component: CategoryDtlComponent
	},
	{
		path: 'category/:id',
		component: CategoryDtlComponent
	},
	{
		path: 'classes',
		component: ClassListComponent
	},
	{
		path: 'class/:id',
		component: ClassDtlComponent
	},
	{
		path: 'class',
		component: ClassDtlComponent
	},
	{
		path: 'groups',
		component: GroupListComponent
	},
	{
		path: 'group/:id',
		component: GroupDtlComponent
	},
	{
		path: 'group',
		component: GroupDtlComponent
	},
	{
		path: 'contents',
		component: ContentListComponent
	},
	{
		path: 'content',
		component: ContentDtlComponent
	},
	{
		path: 'content/:id',
		component: ContentDtlComponent
	},

	{
		path: 'nonclinical',
		component: NonClinicalFBConfigurationComponent
	},

	{
		path: 'nonclinical-one/:id',
		component: NonClinicalFBOneConfigurationComponent
	},
	{
		path: 'providers',
		component: ProviderListComponent
	},
	{
		path: 'provider',
		component: ProviderDtlComponent
	},
	{
		path: 'provider/:id',
		component: ProviderDtlComponent
	},
	{
		path: 'forms',
		component: OnlineFormListComponent
	},
	{
		path: 'promotions',
		component: PromotionListComponent
	},
	{
		path: 'promotion/add',
		component: PromotionAddComponent
	},
	{
		path: 'access',
		component: AccessListComponent
	},
	{
		path: 'access/add',
		component: AccessAddComponent
	},
	{
		path: 'users',
		component: UserListComponent
	},
	{
		path: 'user',
		component: UserDetailComponent
	},
	{
		path: 'user/:id',
		component: UserDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminPortalRoutingModule {}
