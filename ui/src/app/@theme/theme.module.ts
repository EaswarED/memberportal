/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Personal / Commercial License.
 * See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../@shared/shared.module';
// import { NbSelectModule } from '../@shared/components/select/select.module';
import { DefaultLayoutComponent } from './layouts/default.layout';

const MODULES = [CommonModule, RouterModule, SharedModule];

const THEME_COMPONENTS = [DefaultLayoutComponent];

@NgModule({
	declarations: [...THEME_COMPONENTS],
	imports: [
		...MODULES,
		ToastrModule.forRoot({ positionClass: 'inline' }),
		ToastContainerModule
	],
	entryComponents: [],
	exports: [...MODULES, ...THEME_COMPONENTS]
})
export class ThemeModule {
	static forRoot(): ModuleWithProviders<ThemeModule> {
		return {
			ngModule: ThemeModule
		};
	}
}
