import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonClinicalFBConfigurationComponent } from './non-clinical-fb-configuration.component';

describe('NonClinicalFBConfigurationComponent', () => {
	let component: NonClinicalFBConfigurationComponent;
	let fixture: ComponentFixture<NonClinicalFBConfigurationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NonClinicalFBConfigurationComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NonClinicalFBConfigurationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
