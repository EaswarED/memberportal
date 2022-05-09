import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqJoinComponent } from './req-join.component';

describe('ReqJoinComponent', () => {
	let component: ReqJoinComponent;
	let fixture: ComponentFixture<ReqJoinComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ReqJoinComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReqJoinComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
