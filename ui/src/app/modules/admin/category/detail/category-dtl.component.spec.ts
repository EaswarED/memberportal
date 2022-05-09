import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDtlComponent } from './category-dtl.component';

describe('CreateCategoriesComponent', () => {
	let component: CategoryDtlComponent;
	let fixture: ComponentFixture<CategoryDtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CategoryDtlComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CategoryDtlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
