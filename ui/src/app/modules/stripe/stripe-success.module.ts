import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StripeApi } from 'src/app/@core/backend/api/stripe/stripe.api';
import { StripeService } from 'src/app/@core/backend/services/stripe/stripe.service';
import { SharedModule } from 'src/app/@shared/shared.module';
import { StripeSuccessRoutingModule } from './stripe-success-routing.module';
import { StripeSuccessComponent } from './success/stripe-success.component';

const SERVICES = [StripeService];
const API = [StripeApi];

@NgModule({
	declarations: [StripeSuccessComponent],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		StripeSuccessRoutingModule
	],
	providers: [...SERVICES, ...API],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StripeSuccessModule {}
