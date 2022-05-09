import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StripeSuccessComponent } from './success/stripe-success.component';

const routes: Routes = [
	{
		path: 'payment/:id',
		component: StripeSuccessComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StripeSuccessRoutingModule {}
