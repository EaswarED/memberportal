import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { BillingComponent } from './components/billing/billing.component';
import { UserProfileApi } from 'src/app/@core/backend/api/users/user-profile.api';
import { UserProfileService } from 'src/app/@core/backend/services/users/user-profile.service';
import { UpdateProfileApi } from 'src/app/@core/backend/api/users/update-profile.api';
import { UpdateProfileService } from 'src/app/@core/backend/services/users/update-user-profile.service';
import { NotificationApi } from 'src/app/@core/backend/api/users/notification.api';
import { NotificationService } from 'src/app/@core/backend/services/users/notification.service';

const SERVICES = [
	UserProfileService,
	UpdateProfileService,
	NotificationService
];
const API = [UserProfileApi, UpdateProfileApi, NotificationApi];

@NgModule({
	declarations: [
		UserProfileComponent,
		NotificationsComponent,
		BillingComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		ReactiveFormsModule,
		UsersRoutingModule
	],
	providers: [...SERVICES, ...API, DatePipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersModule {}
