import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { PersonalInformationComponent } from './clinical/personal-information/personal-information.component';
import { OnPatientAdditionalInfoComponent } from './clinical/onPatient-AdditionalInfo/onPatient-AdditionalInfo.component';
import { NewPatientComponent } from './clinical/new-patient/new-patient.component';
import { PhqComponent } from './clinical/phq/phq.component';
import { OnPatientApi } from 'src/app/@core/backend/api/onPatient/on-patient.api';
import { OnPatientService } from 'src/app/@core/backend/services/onPatient/on-patient.service';
import { AddPatientApi } from 'src/app/@core/backend/api/onPatient/add-patient.api';
import { AddOnPatientService } from 'src/app/@core/backend/services/onPatient/add-patient.service';
import { FormRoutingModule } from './form-routing.module';
import { MedicalInformationComponent } from './clinical/medical-info/medical-info.component';
import { ChronoFormService } from 'src/app/@core/backend/services/form/chrono-form.service';
import { ChronoFormApi } from 'src/app/@core/backend/api/form/chrono-form.api';
import { GadComponent } from './clinical/gad/gad.component';
import { FanComponent } from './clinical/fan/fan.component';
import { JotSuccessComponent } from './jot-success/jot-success.component';

const SERVICES = [OnPatientService, AddOnPatientService, ChronoFormService];
const API = [OnPatientApi, AddPatientApi, ChronoFormApi];

@NgModule({
	declarations: [
		PersonalInformationComponent,
		OnPatientAdditionalInfoComponent,
		MedicalInformationComponent,
		NewPatientComponent,
		PhqComponent,
		GadComponent,
		FanComponent,
		JotSuccessComponent
	],
	imports: [CommonModule, FormsModule, SharedModule, FormRoutingModule],
	providers: [...SERVICES, ...API],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormModule {}
