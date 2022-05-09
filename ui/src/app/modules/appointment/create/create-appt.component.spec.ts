import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApptComponent } from './create-appt.component';

describe('CreateApptComponent', () => {
	let component: CreateApptComponent;
	let fixture: ComponentFixture<CreateApptComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CreateApptComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateApptComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
