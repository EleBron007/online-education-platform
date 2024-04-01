import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Korisnik } from '../models';

@Component({
  selector: 'app-nastavnikreg',
  templateUrl: './nastavnikreg.component.html',
  styleUrls: ['./nastavnikreg.component.css']
})
export class NastavnikregComponent {
  nastavnik: Korisnik = new Korisnik();
  msg: string = "";
  pitanje: string = "";
  odgovor: string = "";


  constructor(private service: UserService, private router:Router) {}

  nextstep(): void {
    console.log(this.nastavnik)
    this.msg = ""
    this.nastavnik.bezbednosno_pitanje = [{ pitanje: this.pitanje, odgovor: this.odgovor }];
    if (
      this.nastavnik.korisnicko_ime == "" ||
      this.nastavnik.lozinka == "" ||
      this.nastavnik.ime == "" ||
      this.nastavnik.prezime == "" ||
      this.nastavnik.pol == "" ||
      this.nastavnik.adresa == "" ||
      this.nastavnik.kontakt_telefon == "" ||
      this.nastavnik.email_adresa == ""
    )
    {
      this.msg = "Sva polja su obavezna"
      return;
    }
    const passwordRegex = /^(?=[A-Za-z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,10}$/;
    if (!passwordRegex.test(this.nastavnik.lozinka)) {
      this.msg = 'Lozinka ne zadovoljava zahteve';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.nastavnik.email_adresa)) {
      this.msg = 'Greska u email adresi';
      return;
    }

    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(this.nastavnik.kontakt_telefon)) {
      this.msg = 'Greska u broju telefona';
      return;
    }

    if (this.nastavnik.profilna_slika.name!="") {
      console.log(this.nastavnik.profilna_slika)
      if (!['image/png', 'image/jpg'].includes(this.nastavnik.profilna_slika.type)) {
        this.msg = 'Slika mora biti u formatu PNG ili JPG.';
        return;
      }
      const image = new Image();
      image.src = URL.createObjectURL(this.nastavnik.profilna_slika);
      image.onload = () => {
        if (image.width < 100 || image.height < 100 || image.width > 300 || image.height > 300) {
          this.msg = 'Dimenzije slike moraju biti između 100x100 i 300x300 piksela.';
          return;
        }
      }
      if (this.msg = 'Dimenzije slike moraju biti između 100x100 i 300x300 piksela.')
          return;
    }

    this.msg = ""
    this.nastavnik.status = "incomplete"
    this.service.posaljiZahtev(this.nastavnik).subscribe(data=>{
      localStorage.setItem("newNastavnik", JSON.stringify(this.nastavnik))
      this.router.navigate(['nastavnikreg/korak2'])
      this.service.dodajSliku(this.nastavnik.korisnicko_ime, this.slika!).subscribe(data=>{
        console.log(data)
      }, error => {
        this.msg = error.error.error
      })
    }, error => {
      this.msg = error.error.error
    })

  }

  pocetna(){
    this.router.navigate([''])
  }

  slika: File | undefined
  promenaSlike(event: any): void {
    const file = event.target.files[0];
    if (file) {
        this.slika = file;
    }
  }
}
