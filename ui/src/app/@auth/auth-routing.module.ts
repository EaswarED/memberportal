import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgetComponent } from './components/forget/forget.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerificationComponent } from './components/verification/verification.component';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: '',
				component: LoginComponent
			},
			{
				path: 'login',
				component: LoginComponent
			},
			{
				path: 'logout',
				component: LogoutComponent
			},
			{
				path: 'register',
				component: RegisterComponent
			},
			{
				path: 'forgot',
				component: ForgetComponent
			},
			{
				path: 'reset',
				component: ResetPasswordComponent
			},
			{
				path: 'verification',
				component: VerificationComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule {}
