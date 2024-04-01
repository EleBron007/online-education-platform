import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KorisnikupdateComponent } from './korisnikupdate.component';

describe('KorisnikupdateComponent', () => {
  let component: KorisnikupdateComponent;
  let fixture: ComponentFixture<KorisnikupdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KorisnikupdateComponent]
    });
    fixture = TestBed.createComponent(KorisnikupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
