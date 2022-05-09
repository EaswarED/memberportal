import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnPatientAdditionalInfoComponent } from './onPatient-AdditionalInfo.component';

describe('OnPatientAdditionalInfoComponent', () => {
	let component: OnPatientAdditionalInfoComponent;
	let fixture: ComponentFixture<OnPatientAdditionalInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [OnPatientAdditionalInfoComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(OnPatientAdditionalInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
