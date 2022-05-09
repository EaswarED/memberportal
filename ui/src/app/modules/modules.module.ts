import { NgModule } from '@angular/core';
import { SharedModule } from '../@shared/shared.module';
import { DefaultLayoutComponent } from '../@theme/layouts/default.layout';
import { ThemeModule } from '../@theme/theme.module';
import { MainComponent } from './main.component';
import { ModulesRoutingModule } from './modules-routing.module';

@NgModule({
	imports: [ModulesRoutingModule, SharedModule, ThemeModule],
	declarations: [MainComponent]
})
export class ModulesModule {}
