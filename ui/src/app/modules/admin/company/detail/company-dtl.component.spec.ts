import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDtlComponent } from './company-dtl.component';

describe('CompanyDtlComponent', () => {
	let component: CompanyDtlComponent;
	let fixture: ComponentFixture<CompanyDtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CompanyDtlComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CompanyDtlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
