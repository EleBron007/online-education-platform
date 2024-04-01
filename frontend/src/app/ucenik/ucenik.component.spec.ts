import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcenikComponent } from './ucenik.component';

describe('UcenikComponent', () => {
  let component: UcenikComponent;
  let fixture: ComponentFixture<UcenikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UcenikComponent]
    });
    fixture = TestBed.createComponent(UcenikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
