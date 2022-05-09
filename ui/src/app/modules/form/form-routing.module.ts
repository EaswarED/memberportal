import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalInformationComponent } from './clinical/personal-information/personal-information.component';
import { OnPatientAdditionalInfoComponent } from './clinical/onPatient-AdditionalInfo/onPatient-AdditionalInfo.component';
import { NewPatientComponent } from './clinical/new-patient/new-patient.component';
import { MedicalInformationComponent } from './clinical/medical-info/medical-info.component';
import { PhqComponent } from './clinical/phq/phq.component';
import { GadComponent } from './clinical/gad/gad.component';
import { FanComponent } from './clinical/fan/fan.component';
import { JotSuccessComponent } from './jot-success/jot-success.component';

const routes: Routes = [
	{ path: 'personal', component: PersonalInformationComponent },
	{ path: 'cp', component: OnPatientAdditionalInfoComponent },
	{ path: 'new', component: NewPatientComponent },
	{ path: 'medical', component: MedicalInformationComponent },
	{ path: 'phq', component: PhqComponent },
	{ path: 'gad', component: GadComponent },
	{ path: 'fan', component: FanComponent },
	{
		path: 'jot/:clientId/:formId/:submissionId',
		component: JotSuccessComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FormRoutingModule {}
