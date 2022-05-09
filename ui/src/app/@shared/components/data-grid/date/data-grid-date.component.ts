import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
	selector: 'mw-data-grid-date',
	templateUrl: './data-grid-date.component.html',
	styleUrls: ['./data-grid-date.component.scss']
})
export class DataGridDateComponent implements AgRendererComponent {
	params: ICellRendererParams;
	constructor() {}

	agInit(params: ICellRendererParams): void {
		this.params = params;
	}

	refresh(): boolean {
		return false;
	}
}
