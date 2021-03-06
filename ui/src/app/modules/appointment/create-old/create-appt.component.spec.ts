import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppointmentComponent } from './create-appt.component';

describe('CreateAppointmentComponent', () => {
	let component: CreateAppointmentComponent;
	let fixture: ComponentFixture<CreateAppointmentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CreateAppointmentComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateAppointmentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
