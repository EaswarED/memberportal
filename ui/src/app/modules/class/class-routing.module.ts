import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassComponent } from './landing/class.component';
import { CreateClassComponent } from './create-class/create-class.component';
import { ConfirmCancelComponent } from 'src/app/@shared/components/confirm-cancel/confirm-cancel.component';
import { CancelSummaryComponent } from '../actions/cancel-summary/cancel-summary.component';
const routes: Routes = [
	{ path: '', component: ClassComponent },
	{ path: 'create', component: CreateClassComponent },
	{ path: 'cancel', component: CancelSummaryComponent },
	{ path: 'confirm', component: ConfirmCancelComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ClassRoutingModule {}
