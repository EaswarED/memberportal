import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { ConsultComponent } from './consult.component';

const routes: Routes = [
	{
		path: '',
		component: ConsultComponent,
		children: [{ path: 'book', component: BookComponent }]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConsultsRoutingModule {}
