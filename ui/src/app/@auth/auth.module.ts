import {
	ModuleWithProviders,
	NgModule,
	Optional,
	SkipSelf
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../@shared/material/material.module';
import { CreateProfileService } from '../@core/backend/services/bookconsult/create-profile.service';
import { CreateProfileApi } from '../@core/backend/api/bookconsult/create-profile.api';
import { AuthRoutingModule } from './auth-routing.module';
import { ForgetComponent } from './components/forget/forget.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UiMessagingService } from '../@core/backend/services/shared/ui-messaging.service';
import { HttpRequest } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { AuthComponent } from './auth.component';
import { CompaniesService } from '../@core/backend/services/admin/company.service';
import { CompaniesApi } from '../@core/backend/api/admin/company.api';
import { VerificationComponent } from './components/verification/verification.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminGuard } from './guards/admin.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterProfileService } from '../@core/backend/services/register/register.service';
import { UserProfileApi } from '../@core/backend/api/users/user-profile.api';
import { UserProfileService } from '../@core/backend/services/users/user-profile.service';
import { AddOnPatientService } from '../@core/backend/services/onPatient/add-patient.service';
import { AddPatientApi } from '../@core/backend/api/onPatient/add-patient.api';

const API = [
	CreateProfileService,
	UiMessagingService,
	DatePipe,
	CompaniesService,
	RegisterProfileService,
	AddPatientApi,
	CreateProfileApi,
	CompaniesApi,
	UserProfileApi,
	UserProfileService,
	AddOnPatientService
];

const SHARED_COMPONENTS = [
	ForgetComponent,
	LoginComponent,
	RegisterComponent,
	AuthComponent,
	VerificationComponent,
	ResetPasswordComponent
];

const GUARDS = [AuthGuard, AdminGuard];
export function filterInterceptorRequest(req: HttpRequest<any>): boolean {
	return ['/auth', '/auth/forget', '/auth/register'].some((url) =>
		req.url.includes(url)
	);
}

@NgModule({
	providers: [...API, ...GUARDS],
	imports: [MaterialModule, CommonModule, AuthRoutingModule, FormsModule],
	exports: [MaterialModule],
	declarations: [
		...SHARED_COMPONENTS,
		VerificationComponent,
		ResetPasswordComponent,
		LogoutComponent
	]
})
export class AuthModule {
	static forRoot(): ModuleWithProviders<AuthModule> {
		return {
			ngModule: AuthModule
		};
	}
}
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
	if (parentModule) {
		throw new Error(
			`${moduleName} has already been loaded. Import Core modules in the AppModule only.`
		);
	}
}
