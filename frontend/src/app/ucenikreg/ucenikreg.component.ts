import { Component } from '@angular/core';
import { Korisnik } from '../models';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ucenikreg',
  templateUrl: './ucenikreg.component.html',
  styleUrls: ['./ucenikreg.component.css']
})
export class UcenikregComponent {
  ucenik: Korisnik = new Korisnik();
  msg: string = "";
  uspeh: boolean = false;
  pitanje: string = "";
  odgovor: string = "";
  sent: boolean = false;
  profilna_slika: File = new File([""], "default.png", { type: "image/png" });


  constructor(private service: UserService, private router:Router, private sanitizer: DomSanitizer) {}

  registerUcenik(): void {
    console.log(this.ucenik)
    this.msg = ""
    this.ucenik.bezbednosno_pitanje = [{ pitanje: this.pitanje, odgovor: this.odgovor }];

    if (
      this.ucenik.korisnicko_ime == "" ||
      this.ucenik.lozinka == "" ||
      this.ucenik.ime == "" ||
      this.ucenik.prezime == "" ||
      this.ucenik.pol == "" ||
      this.ucenik.adresa == "" ||
      this.ucenik.kontakt_telefon == "" ||
      this.ucenik.email_adresa == "" ||
      this.ucenik.tip_skole == "" ||
      this.ucenik.trenutni_razred == 0
    )
    {
      this.msg = "Sva polja su obavezna"
      return;
    }
    const passwordRegex = /^(?=[A-Za-z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,10}$/;
    if (!passwordRegex.test(this.ucenik.lozinka)) {
      this.msg = 'Lozinka ne zadovoljava zahteve';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.ucenik.email_adresa)) {
      this.msg = 'Greska u email adresi';
      return;
    }

    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(this.ucenik.kontakt_telefon)) {
      this.msg = 'Greska u broju telefona';
      return;
    }

    if (this.ucenik.tip_skole === 'osnovna' && (this.ucenik.trenutni_razred < 1 || this.ucenik.trenutni_razred > 8)) {
      this.msg = 'Greska: razred i tip skole se ne slazu';
      return;
    }

    if (this.ucenik.tip_skole !== 'osnovna' && (this.ucenik.trenutni_razred < 1 || this.ucenik.trenutni_razred > 4)) {
      this.msg = 'Greska: razred i tip skole se ne slazu';
      return;
    }

    if (this.ucenik.profilna_slika && this.ucenik.profilna_slika.name !== "") {
      if (!['image/png', 'image/jpg'].includes(this.ucenik.profilna_slika.type)) {
        this.msg = 'Slika mora biti u formatu PNG ili JPG.';
        return;
      }

      this.checkImageDimensions(this.ucenik.profilna_slika)
        .then((isValidDimensions) => {
          if (!isValidDimensions) {
            this.msg = 'Dimenzije slike moraju biti između 100x100 i 300x300 piksela.';
            return;
          }

          // Continue with the rest of your logic (registering and uploading image)
          this.msg = "";
          this.service.registerUcenik(this.ucenik).subscribe(
            (data) => {
              console.log('Ucenik Registration Successful:', data);
              this.uspeh = true;
              this.msg = 'Uspesno ste registrovani';
              this.service.dodajSliku(this.ucenik.korisnicko_ime, this.ucenik.profilna_slika).subscribe(data => {
                console.log(data);
                this.uspeh = true;
                this.sent = true
                this.msg = 'Uspeh';
              });
            },
            (error) => {
              this.msg = error.error.error;
              console.error('Registracija ucenika je neuspesna:', error);
            }
          );
        });
    } else {
      // Continue with the rest of your logic (registering without uploading image)
      this.msg = "";
      this.service.registerUcenik(this.ucenik).subscribe(
        (data) => {
          console.log('Ucenik Registration Successful:', data);
          this.uspeh = true;
          this.sent = true
          this.msg = 'Uspeh';
        },
        (error) => {
          this.msg = error.error.error;
          console.error('Registracija ucenika je neuspesna:', error);
        }
      );
    }
  }

  pocetna(){
    this.router.navigate([''])
  }

  promenaSlike(event: any): void {
    const file = event.target.files[0];
    if (file) {
        this.ucenik.profilna_slika = file;
    }
  }



  slikab: any = null;

  dohvatiSliku1() {
    this.service.dohvatiSliku("aaadefault.png").subscribe((data) => {
      const urlCreator = window.URL || window.webkitURL;
      this.slikab = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
    });
  }

  checkImageDimensions(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        console.log(image.height);
        console.log(image.width);
        const isValidDimensions = image.width >= 100 && image.height >= 100 && image.width <= 300 && image.height <= 300;
        resolve(isValidDimensions);
      };
    });
  }


}

