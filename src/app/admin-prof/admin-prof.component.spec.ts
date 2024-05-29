import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfComponent } from './admin-prof.component';

describe('AdminProfComponent', () => {
  let component: AdminProfComponent;
  let fixture: ComponentFixture<AdminProfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
