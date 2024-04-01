import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromenalozinkeComponent } from './promenalozinke.component';

describe('PromenalozinkeComponent', () => {
  let component: PromenalozinkeComponent;
  let fixture: ComponentFixture<PromenalozinkeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromenalozinkeComponent]
    });
    fixture = TestBed.createComponent(PromenalozinkeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
