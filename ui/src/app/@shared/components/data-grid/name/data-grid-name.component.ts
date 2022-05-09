import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
	selector: 'mw-data-grid-name',
	templateUrl: './data-grid-name.component.html',
	styleUrls: ['./data-grid-name.component.scss']
})
export class DataGridNameComponent implements AgRendererComponent {
	params: ICellRendererParams;
	constructor() {}

	agInit(params: ICellRendererParams): void {
		this.params = params;
	}

	refresh(): boolean {
		return false;
	}
}
