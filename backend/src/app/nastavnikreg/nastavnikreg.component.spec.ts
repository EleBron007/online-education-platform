import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NastavnikregComponent } from './nastavnikreg.component';

describe('NastavnikregComponent', () => {
  let component: NastavnikregComponent;
  let fixture: ComponentFixture<NastavnikregComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NastavnikregComponent]
    });
    fixture = TestBed.createComponent(NastavnikregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
