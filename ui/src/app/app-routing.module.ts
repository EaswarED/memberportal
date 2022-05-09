import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './@auth/guards/auth.guard';

const routes: Routes = [
	{
		path: 'modules',
		canActivateChild: [AuthGuard],
		loadChildren: () =>
			import('./modules/modules.module').then((m) => m.ModulesModule)
	},
	{
		path: 'consult',
		loadChildren: () =>
			import('./modules/consult/consult.module').then(
				(m) => m.ConsultsModule
			)
	},
	{
		path: 'auth',
		loadChildren: () =>
			import('./@auth/auth.module').then((m) => m.AuthModule)
	},
	{
		path: 'stripe',
		canActivateChild: [AuthGuard],
		loadChildren: () =>
			import('./modules/stripe/stripe-success.module').then(
				(m) => m.StripeSuccessModule
			)
	},
	{ path: '**', redirectTo: 'modules' }
];

const config: ExtraOptions = {
	useHash: true
};

@NgModule({
	imports: [RouterModule.forRoot(routes, config)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
