import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminpocetnaComponent } from './adminpocetna.component';

describe('AdminpocetnaComponent', () => {
  let component: AdminpocetnaComponent;
  let fixture: ComponentFixture<AdminpocetnaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminpocetnaComponent]
    });
    fixture = TestBed.createComponent(AdminpocetnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
