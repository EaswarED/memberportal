import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsComponent } from './landing/groups.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { ConfirmCancelComponent } from 'src/app/@shared/components/confirm-cancel/confirm-cancel.component';
import { ReqJoinComponent } from './req-join/req-join.component';
import { CancelSummaryComponent } from '../actions/cancel-summary/cancel-summary.component';

const routes: Routes = [
	{ path: '', component: GroupsComponent },
	{ path: 'create', component: CreateGroupComponent },
	{ path: 'cancel', component: CancelSummaryComponent },
	{ path: 'confirm', component: ConfirmCancelComponent },
	{ path: 'join', component: ReqJoinComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GroupRoutingModule {}
