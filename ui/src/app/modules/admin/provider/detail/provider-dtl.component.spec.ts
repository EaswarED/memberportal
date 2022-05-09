import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderDtlComponent } from './provider-dtl.component';

describe('ProviderDtlComponent', () => {
	let component: ProviderDtlComponent;
	let fixture: ComponentFixture<ProviderDtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProviderDtlComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ProviderDtlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
