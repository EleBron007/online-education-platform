import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Korisnik, Predmet } from '../models';

@Component({
  selector: 'app-korisnikupdate',
  templateUrl: './korisnikupdate.component.html',
  styleUrls: ['./korisnikupdate.component.css']
})
export class KorisnikupdateComponent implements OnInit{


  /*svipredmeti: string[] = [
    "Matematika", "Fizika", "Hemija", "Informatika",
    "Programiranje", "Srpski jezik i književnost",
    "Engleski jezik", "Nemački jezik", "Italijanski jezik",
    "Francuski jezik", "Španski jezik", "Latinski jezik",
    "Biologija", "Istorija", "Geografija", "Svet oko nas"
  ];*/

  sviuzrasti: string[] = [
    'osnovna 1-4', 'osnovna 5-8', 'srednja'
  ];

  korisnik: Korisnik | undefined
  msg: string = ""
  predmeti: string[] = [];
  uzrasti: string[] = [];
  cv: File| undefined
  slika: File | undefined
  slikab: any = null
  svipredmeti: Predmet[] = []


  constructor(private router: Router, private service: UserService, private sanitizer: DomSanitizer){}
  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem("korisnikUpdate")!)
    this.service.getKorisnik(this.korisnik!.korisnicko_ime).subscribe(data =>{
      this.korisnik = data
      this.uzrasti = this.korisnik!.uzrasti
      this.predmeti = this.korisnik!.predmeti
      this.service.dohvatiSliku(this.korisnik?.profilna_slika_path!).subscribe((data) => {
        const urlCreator = window.URL || window.webkitURL;
        this.slikab = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
        this.service.getSviPredmeti().subscribe(data=>{
          this.svipredmeti = data
        })
      });
    })
  }

  saveProfile(): void {
    if (!this.korisnik!.ime || !this.korisnik!.prezime || !this.korisnik!.adresa ||
        !this.korisnik!.email_adresa || !this.korisnik!.kontakt_telefon) {
      this.msg = "Sva polja su obavezna";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.korisnik!.email_adresa)) {
      this.msg = "Greska u email adresi";
      return;
    }

    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(this.korisnik!.kontakt_telefon)) {
      this.msg = "Greska u broju telefona";
      return;
    }

    if(this.predmeti.length == 0){
      this.msg = "Unesite bar 1 predmet"
      return;
    }
    if(this.uzrasti.length == 0){
      this.msg = "Unesite bar 1 uzrast"
      return;
    }

    if (this.slika && this.slika?.name !== "") {
      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(this.slika.type)) {
        this.msg = 'Slika mora biti u formatu PNG ili JPG.';
        return;
      }

      this.checkImageDimensions(this.slika)
        .then((isValidDimensions) => {
          if (!isValidDimensions) {
            this.msg = 'Dimenzije slike moraju biti između 100x100 i 300x300 piksela.';
            console.log(this.msg);
            return;
          }


          this.msg = "Uspeh";
          this.korisnik!.predmeti = [...this.predmeti]
          this.korisnik!.uzrasti = [...this.uzrasti]
          console.log("KORISNIK")
          console.log(this.korisnik)

          this.service.updateKorisnik(this.korisnik!).subscribe(data => {
            console.log("received");
            console.log(data);
            this.service.dodajSliku(this.korisnik!.korisnicko_ime, this.slika!).subscribe(data => {
              console.log(data);
              this.msg = "";
              const maxFileSizeInMB = 3;
              const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;
              if (this.cv != undefined && this.cv.size <= maxFileSizeInBytes) {
                this.service.dodajCV(this.korisnik!.korisnicko_ime, this.cv).subscribe(data=>{
                  console.log(data)
                  this.ngOnInit()
                })
              }else
              this.ngOnInit()
            });
          });
        });
    } else {
      console.log("KORISNIK")
      console.log(this.korisnik)
      this.msg = "";
      this.korisnik!.predmeti = [...this.predmeti]
      this.korisnik!.uzrasti = [...this.uzrasti]
      this.service.updateKorisnik(this.korisnik!).subscribe(data => {
        console.log("received");
        console.log(data);
        this.msg = "Uspeh";
              const maxFileSizeInMB = 3;
              const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;
              if (this.cv != undefined && this.cv.size <= maxFileSizeInBytes) {
                this.service.dodajCV(this.korisnik!.korisnicko_ime, this.cv).subscribe(data=>{
                  console.log(data)
                  this.ngOnInit()
                })
              }else
              this.ngOnInit()
      });
    }
  }

  selectPredmet(p: string): void {
      if (this.predmeti.includes(p)) {
        this.predmeti = this.predmeti.filter(s => s !== p);
      } else {
        this.predmeti.push(p);
      }
    console.log(this.predmeti);
  }

  promenaCV(event: any): void {
    const file = event.target.files[0];
    if (file) {
        this.cv = file;
    }
  }

  selectUzrast(u: string): void {
    if (this.uzrasti.includes(u)) {
      this.uzrasti = this.uzrasti.filter(a => a !== u);
    } else {
      this.uzrasti.push(u);
    }
    console.log(this.uzrasti)
  }




  promenaSlike(event: any): void {
    const file = event.target.files[0];
    if (file) {
        this.slika = file;
    }
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
