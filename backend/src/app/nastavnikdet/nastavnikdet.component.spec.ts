import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NastavnikdetComponent } from './nastavnikdet.component';

describe('NastavnikdetComponent', () => {
  let component: NastavnikdetComponent;
  let fixture: ComponentFixture<NastavnikdetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NastavnikdetComponent]
    });
    fixture = TestBed.createComponent(NastavnikdetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
