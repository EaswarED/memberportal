import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesConfigurationComponent } from './category-list.component';

describe('CategoriesConfigurationComponent', () => {
	let component: CategoriesConfigurationComponent;
	let fixture: ComponentFixture<CategoriesConfigurationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CategoriesConfigurationComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CategoriesConfigurationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
