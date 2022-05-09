import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfCareInformationComponent } from './selfcare-information.component';

describe('AppointmentsComponent', () => {
	let component: SelfCareInformationComponent;
	let fixture: ComponentFixture<SelfCareInformationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SelfCareInformationComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SelfCareInformationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
