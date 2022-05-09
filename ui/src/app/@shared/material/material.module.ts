import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const MODULES = [
	FlexLayoutModule,
	ReactiveFormsModule,
	FormsModule,
	MatButtonModule,
	MatExpansionModule,
	MatSelectModule,
	MatIconModule,
	MatDatepickerModule,
	MatChipsModule,
	MatListModule,
	MatMenuModule,
	MatTooltipModule,
	MatToolbarModule,
	MatCardModule,
	MatStepperModule,
	MatDividerModule,
	MatToolbarModule,
	MatDividerModule,
	MatBadgeModule,
	MatTableModule,
	MatFormFieldModule,
	MatInputModule,
	MatPaginatorModule,
	MatSortModule,
	MatNativeDateModule,
	MatRippleModule,
	MatRadioModule,
	MatDialogModule,
	MatAutocompleteModule,
	MatCheckboxModule,
	MatTabsModule,
	MatGridListModule,
	MatSlideToggleModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatSidenavModule,
	MatBottomSheetModule,
	MatButtonToggleModule
];

@NgModule({
	imports: MODULES,
	providers: [MatIconRegistry],
	exports: MODULES
})
export class MaterialModule {}
