import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Constants } from '../../utils/constants';

@Component({
	selector: 'mw-data-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
	@Input() columnDefs: ColDef[];
	@Input() rowData: any;
	@Input() frameworkComponents: any;
	@Input() paginationPageSize: number = Constants.DEFAULT_GRID_PAGE_SIZE;
	@Input() defaultColDef: any;
	@Input() sortModel: any;
	@Input() context: any;
	@Input() rowSelection: any = 'single';

	@Output() rowEventClicks = new EventEmitter<any>();
	@Output() rowSelectionChanged = new EventEmitter<any>();

	testVar = [];
	gridApi: any;
	gridColumnApi: any;

	constructor() {}
	onGridSizeChanged(params: any) {
		if (params && params.api) {
			const allColumnIds: any[] = [];
			this.gridColumnApi
				.getAllColumns()
				.forEach((column: { colId: any }) => {
					allColumnIds.push(column.colId);
				});

			params.api.sizeColumnsToFit(allColumnIds, false);
		}
	}

	onGridReady(params: any): void {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		const sortModel = this.sortModel;
		this.gridApi.setSortModel(sortModel);
	}

	gridOptions = {
		columnTypes: {
			nonEditableColumn: { editable: true },
			numberColumn: { filter: 'agNumberColumnFilter' },
			textColumn: { filter: 'agTextColumnFilter' },
			dateColumn: { filter: 'agDateColumnFilter' }
		},
		defaultColDef: {
			width: 100
		},
		rowDragManaged: true,
		animateRows: true
	};

	onRowSelect(event: any) {
		this.rowEventClicks.emit(event);
	}

	onRowClicked(event: any) {
		this.rowEventClicks.emit(event);
	}

	onSelectionChanged(event: any) {
		this.rowSelectionChanged.emit(event);
	}
}
