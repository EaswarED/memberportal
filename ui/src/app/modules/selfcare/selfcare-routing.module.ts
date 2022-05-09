import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelfCareComponent } from '../selfcare/landing/selfcare.component';
import { SelfCareInformationComponent } from './selfcare-information/selfcare-information.component';

const routes: Routes = [
	{ path: '', component: SelfCareComponent },
	{ path: 'information', component: SelfCareInformationComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SelfCareRoutingModule {}
