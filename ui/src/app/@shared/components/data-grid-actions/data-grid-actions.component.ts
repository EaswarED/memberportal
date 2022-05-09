import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component
} from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { AgRendererComponent } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { DialogOverviewComponent } from 'src/app/@shared/components/dialog-overview/dialog-overview.component';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subject } from 'rxjs';
import { TimeSpan } from 'src/app/@core/interfaces/shared/timer';
import { UnderscorePipe } from 'src/app/@shared/pipes/index';
import { Logger } from '../../utils/logger';

@Component({
	selector: 'mw-data-grid-actions',
	templateUrl: './data-grid-actions.component.html',
	styleUrls: ['./data-grid-actions.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [UnderscorePipe]
})
export class DataGridActionsComponent implements AgRendererComponent {
	params: ICellRendererParams;
	data: any;
	isDefault: boolean = true;

	actionList: any;
	defaultActions = [
		{
			tip: 'Edit',
			action: 'edit',
			editIcon: 'create',
			addIcon: 'add'
		}
	];

	constructor(
		public dialog: MatDialog,
		private changeDetector: ChangeDetectorRef,
		private router: Router
	) {}

	agInit(params: ICellRendererParams): void {
		this.params = params;
		this.data = params.data;
		if (this.params.context.getActions) {
			// Custom actions passed from the Parent
			this.actionList = params.context.getActions();
			this.isDefault = false;
		} else {
			this.actionList = this.defaultActions;
		}
	}

	refresh(): boolean {
		return false;
	}

	btnClicked(action: string) {
		this.params.context.receiveAction({ action, data: this.params.data });
	}
}
