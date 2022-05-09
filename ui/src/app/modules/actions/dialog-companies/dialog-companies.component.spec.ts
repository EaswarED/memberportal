import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCompaniesComponent } from './dialog-companies.component';

describe('DialogCompaniesComponent', () => {
	let component: DialogCompaniesComponent;
	let fixture: ComponentFixture<DialogCompaniesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DialogCompaniesComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DialogCompaniesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
