import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../@auth/guards/admin.guard';
import { AuthGuard } from '../@auth/guards/auth.guard';
import { MainComponent } from './main.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent,
		children: [
			{
				path: 'dashboard',
				canActivateChild: [AuthGuard],
				loadChildren: () =>
					import('./dashboard/dashboard.module').then(
						(m) => m.DashboardModule
					)
			},
			{
				path: 'appt',
				canActivateChild: [AuthGuard],
				loadChildren: () =>
					import('./appointment/appt.module').then(
						(m) => m.ApptModule
					)
			},
			{
				path: 'client',
				canActivateChild: [AuthGuard],
				loadChildren: () =>
					import('./form/form.module').then((m) => m.FormModule)
			},
			{
				path: 'class',
				canActivateChild: [AuthGuard],
				loadChildren: () =>
					import('./class/class.module').then((m) => m.ClassModule)
			},
			{
				path: 'group',
				canActivateChild: [AuthGuard],
				loadChildren: () =>
					import('./group/group.module').then((m) => m.GroupModule)
			},
			{
				path: 'admin',
				canActivateChild: [AdminGuard],
				loadChildren: () =>
					import('./admin/admin-portal.module').then(
						(m) => m.AdminPortalModule
					)
			},
			{
				path: 'users',
				canActivateChild: [AuthGuard],
				loadChildren: () =>
					import('./users/users.module').then((m) => m.UsersModule)
			},
			{
				path: 'selfcare',
				canActivateChild: [AuthGuard],
				loadChildren: () =>
					import('./selfcare/selfcare.module').then(
						(m) => m.SelfCareModule
					)
			},
			{
				path: 'checkin',
				canActivateChild: [AuthGuard],
				loadChildren: () =>
					import('./actions/actions.module').then(
						(m) => m.ActionsModule
					)
			},
			{ path: '**', redirectTo: 'dashboard' }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ModulesRoutingModule {}
