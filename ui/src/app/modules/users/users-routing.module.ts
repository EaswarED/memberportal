import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { BillingComponent } from './components/billing/billing.component';
const routes: Routes = [
	{ path: '', component: UserProfileComponent },
	{ path: 'billing', component: BillingComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UsersRoutingModule {}
