import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonClinicalFBOneConfigurationComponent } from './non-clinical-fb-one-configuration.component';

describe('NonClinicalFBOneConfigurationComponent', () => {
	let component: NonClinicalFBOneConfigurationComponent;
	let fixture: ComponentFixture<NonClinicalFBOneConfigurationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NonClinicalFBOneConfigurationComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(
			NonClinicalFBOneConfigurationComponent
		);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
