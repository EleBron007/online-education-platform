import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcenikregComponent } from './ucenikreg.component';

describe('UcenikregComponent', () => {
  let component: UcenikregComponent;
  let fixture: ComponentFixture<UcenikregComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UcenikregComponent]
    });
    fixture = TestBed.createComponent(UcenikregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
