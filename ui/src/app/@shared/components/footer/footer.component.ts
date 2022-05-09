import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'mw-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
	lastBuildDt: any;

	constructor() {
		let buildDt = environment.buildDt;
		if (buildDt !== 'FILL') {
			this.lastBuildDt = new Date(buildDt);
		}
	}
}
