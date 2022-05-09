import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineFormListComponent } from './online-form-list.component';

describe('OnlineFormListComponent', () => {
	let component: OnlineFormListComponent;
	let fixture: ComponentFixture<OnlineFormListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [OnlineFormListComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(OnlineFormListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
