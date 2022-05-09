import {
	ModuleWithProviders,
	NgModule,
	Optional,
	SkipSelf
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../@shared/material/material.module';
import { BaseApi } from './backend/api/shared/base.api';

const API = [BaseApi];

@NgModule({
	providers: [...API],
	imports: [MaterialModule, CommonModule]
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		throwIfAlreadyLoaded(parentModule, 'CoreModule');
	}

	static forRoot(): ModuleWithProviders<CoreModule> {
		return {
			ngModule: CoreModule
		};
	}
}
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
	if (parentModule) {
		throw new Error(
			`${moduleName} has already been loaded. Import Core modules in the AppModule only.`
		);
	}
}
