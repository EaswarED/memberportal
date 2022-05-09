import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSummaryComponent } from './cancel-summary.component';

describe('CancelSummaryComponent', () => {
	let component: CancelSummaryComponent;
	let fixture: ComponentFixture<CancelSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CancelSummaryComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CancelSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
