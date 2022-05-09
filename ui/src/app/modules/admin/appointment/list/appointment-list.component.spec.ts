import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApppointmentListComponent } from './appointment-list.component';

describe('ApppointmentListComponent', () => {
	let component: ApppointmentListComponent;
	let fixture: ComponentFixture<ApppointmentListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ApppointmentListComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ApppointmentListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
