import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentDtlComponent } from './appointment-dtl.component';

describe('AppointmentDtlComponent', () => {
	let component: AppointmentDtlComponent;
	let fixture: ComponentFixture<AppointmentDtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AppointmentDtlComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AppointmentDtlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
