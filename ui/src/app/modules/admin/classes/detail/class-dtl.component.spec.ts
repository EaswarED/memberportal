import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassDtlComponent } from './class-dtl.component';

describe('ClassDtlComponent', () => {
	let component: ClassDtlComponent;
	let fixture: ComponentFixture<ClassDtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ClassDtlComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ClassDtlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
