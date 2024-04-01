import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcenikdetComponent } from './ucenikdet.component';

describe('UcenikdetComponent', () => {
  let component: UcenikdetComponent;
  let fixture: ComponentFixture<UcenikdetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UcenikdetComponent]
    });
    fixture = TestBed.createComponent(UcenikdetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
