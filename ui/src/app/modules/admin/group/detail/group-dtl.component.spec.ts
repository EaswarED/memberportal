import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupDtlComponent } from './group-dtl.component';

describe('GroupDtlComponent', () => {
	let component: GroupDtlComponent;
	let fixture: ComponentFixture<GroupDtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GroupDtlComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(GroupDtlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
