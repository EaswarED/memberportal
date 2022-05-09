import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './@core/core.module';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { SharedModule } from './@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConsultsModule } from './modules/consult/consult.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AuthModule } from './@auth/auth.module';
import { JwtInterceptor } from './@auth/settings/jwt.interceptor';
import { StripeSuccessModule } from './modules/stripe/stripe-success.module';
import { ErrorInterceptor } from './@auth/settings/error.interceptor';
export function init_app(injector: Injector) {
	return () =>
		new Promise<any>((resolve: Function) => {
			resolve();
		});
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		SharedModule.forRoot(),
		CoreModule.forRoot(),
		AuthModule.forRoot(),
		ToastrModule.forRoot({ positionClass: 'inline' }),
		ToastContainerModule,
		ConsultsModule,
		StripeSuccessModule,
		CommonModule,
		FormsModule,
		FlatpickrModule,
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		})
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: init_app,
			deps: [Injector],
			multi: true
		},
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
