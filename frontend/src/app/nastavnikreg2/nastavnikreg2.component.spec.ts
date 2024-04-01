import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nastavnikreg2Component } from './nastavnikreg2.component';

describe('Nastavnikreg2Component', () => {
  let component: Nastavnikreg2Component;
  let fixture: ComponentFixture<Nastavnikreg2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Nastavnikreg2Component]
    });
    fixture = TestBed.createComponent(Nastavnikreg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
