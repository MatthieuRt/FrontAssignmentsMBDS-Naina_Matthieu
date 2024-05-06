import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssignmentsComponent } from './list-assignments.component';

describe('ListAssignmentsComponent', () => {
  let component: ListAssignmentsComponent;
  let fixture: ComponentFixture<ListAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAssignmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
