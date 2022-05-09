import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldAppointmentsComponent } from './appointments.component';

describe('OldAppointmentsComponent', () => {
	let component: OldAppointmentsComponent;
	let fixture: ComponentFixture<OldAppointmentsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [OldAppointmentsComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(OldAppointmentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
