import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineFormDetailComponent } from './online-form-detail.component';

describe('OnlineFormDetailComponent', () => {
	let component: OnlineFormDetailComponent;
	let fixture: ComponentFixture<OnlineFormDetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [OnlineFormDetailComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(OnlineFormDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
