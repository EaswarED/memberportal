import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDtlComponent } from './content-dtl.component';

describe('CreateSelfcareConfigurationComponent', () => {
	let component: ContentDtlComponent;
	let fixture: ComponentFixture<ContentDtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ContentDtlComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ContentDtlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
